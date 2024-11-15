import { Request, Response } from 'express';
import { generateUploadUrl, deleteImageFromFirebase } from '../utils/firebase.utils';
import { User } from '../models/user';
// import { RequestWithUser } from '../types/custom';
import path from 'path';
import { uploadFileToFirebase } from './storage.controller';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../config/firebase.config'; // Adjust the path as needed

export class ImageController {
  
  static async getUploadUrl(req: Request, res: Response) {
    try {
        const userId = req.params.userId;
        const { contentType, folder } = req.body;

        if (!contentType || !folder) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        const fileName = `${timestamp}-${randomString}`;
        const filePath = `${folder}/${userId}/${fileName}`;

        const uploadUrl = await generateUploadUrl(userId, filePath, contentType);

        res.json({
            success: true,
            data: {
                uploadUrl,
                fileName,
                fullPath: filePath,
                downloadUrl: `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${filePath}`
            }
        });
    } catch (error) {
        console.error('Error generating upload URL:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate upload URL'
        });
    }
}


  // Update user's profile picture
  static async updateProfilePicture(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const { fileName, profilePictureSettings } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const filePath = `profileImages/${userId}/${fileName}`;

      // Update user
      await user.update({
        imgUrl: filePath,
        profilePictureSettings: profilePictureSettings
      });

      res.json({
        success: true,
        user: user
      });
    } catch (error) {
      console.error('Error updating profile picture:', error);
      res.status(500).json({ error: 'Failed to update profile picture' });
    }
  }

  static async getDownloadUrl(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { fileName } = req.body;
  
      const filePath = `profileImages/${userId}/${fileName}`;
      const bucket = storage.bucket();
      const file = bucket.file(filePath);
  
      // Generate signed URL
      const [downloadUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
      });
  
      res.json({
        success: true,
        downloadUrl,
      });
    } catch (error) {
      console.error('Error generating download URL:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate download URL',
      });
    }
  }

  // Delete profile picture
  static async deleteProfilePicture(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
      
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.imgUrl) {
        await deleteImageFromFirebase(user.imgUrl);
      }

      await user.update({
        imgUrl: null,
        profilePictureSettings: null
      });

      res.json({
        success: true,
        message: 'Profile picture deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      res.status(500).json({ error: 'Failed to delete profile picture' });
    }
  }

  // image.controller.ts
static async getSignedImageUrl(req: Request, res: Response) {
  try {
    const { userId, fileName } = req.params;
    const filePath = `staging/profileImages/${userId}/${fileName}`;
    const bucket = storage.bucket();
    const file = bucket.file(filePath);
    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });
    res.json({ success: true, url: signedUrl });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    res.status(500).json({ success: false, message: 'Failed to generate signed URL' });
  }
 }
}

export async function uploadImage(req: Request, res: Response) {
  try {
    const userId = req.params.userId;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    const bucket = storage.bucket();

    // Clean up any existing staged files for this user
    // await cleanupStagedFiles(userId, bucket);

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileName = `${timestamp}-${randomString}${path.extname(file.originalname)}`;
    const filePath = `staging/profileImages/${userId}/${fileName}`;

    console.log('Processing upload:', { userId, fileName, filePath });

    const fileRef = bucket.file(filePath);

    // Upload file
    await new Promise((resolve, reject) => {
      const writeStream = fileRef.createWriteStream({
        metadata: {
          contentType: file.mimetype,
          metadata: {
            originalName: file.originalname,
            uploadedAt: new Date().toISOString()
          }
        }
      });

      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
      writeStream.end(file.buffer);
    });

    // Verify upload
    const [exists] = await fileRef.exists();
    if (!exists) {
      throw new Error('File upload verification failed');
    }

    // Return success response with all required fields
    const response = {
      success: true,
      fileName,
      filePath,
      contentType: file.mimetype
    };

    console.log('Upload successful:', response);
    res.json(response);

  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Upload failed',
      error: error.message 
    });
  }
}




