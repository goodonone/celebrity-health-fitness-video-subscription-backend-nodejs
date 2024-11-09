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


// export async function uploadImage(req: Request, res: Response) {
//   try {
//     const userId = req.params.userId;
//     const file = req.file;

//     console.log('UPLOAD REQUEST RECEIVED:', { 
//       userId,
//       filePresent: !!file,
//       fileDetails: file ? {
//         originalname: file.originalname,
//         mimetype: file.mimetype,
//         size: file.size
//       } : null
//     });

//     if (!file) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'No file uploaded' 
//       });
//     }

//     // Generate unique filename
//     const timestamp = Date.now();
//     const randomString = Math.random().toString(36).substring(2, 8);
//     const fileName = `${timestamp}-${randomString}${path.extname(file.originalname)}`;
    
//     // Define file path
//     const filePath = `staging/profileImages/${userId}/${fileName}`;

//     console.log('Processing upload:', { fileName, filePath });

//     // Upload to Firebase
//     const bucket = storage.bucket();
//     const fileRef = bucket.file(filePath);

//     // Create write stream
//     const writeStream = fileRef.createWriteStream({
//       metadata: {
//         contentType: file.mimetype,
//         metadata: {
//           originalName: file.originalname,
//           uploadedAt: new Date().toISOString()
//         }
//       }
//     });

//     // Handle upload completion
//     await new Promise((resolve, reject) => {
//       writeStream.on('finish', resolve);
//       writeStream.on('error', reject);
//       writeStream.end(file.buffer);
//     });

//     // Return success with all required fields
//     res.json({
//       success: true,
//       fileName: fileName,
//       filePath: filePath,
//       contentType: file.mimetype
//     });

//   } catch (error: any) {
//     console.error('Upload error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Upload failed',
//       error: error.message 
//     });
//   }
// }

// controllers/image.controller.ts

// export async function uploadImage(req: Request, res: Response) {
//   try {
//     const userId = req.params.userId;
//     const file = req.file;

//     console.log('Upload request received:', { 
//       userId,
//       filePresent: !!file,
//       fileDetails: file ? {
//         originalname: file.originalname,
//         mimetype: file.mimetype,
//         size: file.size
//       } : null
//     });

//     if (!file) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'No file uploaded' 
//       });
//     }

//     // Generate unique filename
//     const timestamp = Date.now();
//     const randomString = Math.random().toString(36).substring(2, 8);
//     const fileName = `${timestamp}-${randomString}${path.extname(file.originalname)}`;
    
//     // Define file path
//     const filePath = `staging/profileImages/${userId}/${fileName}`;

//     console.log('Processing upload:', { fileName, filePath });

//     try {
//       // Upload to Firebase
//       const bucket = storage.bucket();
//       const fileRef = bucket.file(filePath);

//       // Create write stream
//       const writeStream = fileRef.createWriteStream({
//         metadata: {
//           contentType: file.mimetype,
//           metadata: {
//             originalName: file.originalname,
//             uploadedAt: new Date().toISOString()
//           }
//         }
//       });

//       // Handle upload completion
//       await new Promise((resolve, reject) => {
//         writeStream.on('finish', resolve);
//         writeStream.on('error', reject);
//         writeStream.end(file.buffer);
//       });

//       // Return success with all required fields
//       const response = {
//         success: true,
//         fileName: fileName,
//         filePath: filePath,
//         contentType: file.mimetype
//       };

//       console.log('Upload successful, sending response:', response);
//       res.json(response);

//     } catch (uploadError) {
//       console.error('Firebase upload error:', uploadError);
//       throw uploadError;
//     }

//   } catch (error: any) {
//     console.error('Upload error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Upload failed',
//       error: error.message 
//     });
//   }
// }

// controllers/storage.controller.ts or image.controller.ts
// async function cleanupStagedFiles(userId: string, bucket: any) {
//   try {
//     const stagingPath = `staging/profileImages/${userId}/`;
//     const [files] = await bucket.getFiles({ prefix: stagingPath });
    
//     for (const file of files) {
//       await file.delete();
//       console.log(`Deleted staged file: ${file.name}`);
//     }
//   } catch (error) {
//     console.error('Error cleaning up staged files:', error);
//   }
// }

// export async function uploadImage(req: Request, res: Response) {
//   try {
//     const userId = req.params.userId;
//     const file = req.file;

//     console.log('Upload request received:', { 
//       userId,
//       filePresent: !!file,
//       fileDetails: file ? {
//         originalname: file.originalname,
//         mimetype: file.mimetype,
//         size: file.size
//       } : null
//     });

//     if (!file) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'No file uploaded' 
//       });
//     }

//     const bucket = storage.bucket();
//     await cleanupStagedFiles(userId, bucket);

//     // Generate unique filename
//     const timestamp = Date.now();
//     const randomString = Math.random().toString(36).substring(2, 8);
//     const fileName = `${timestamp}-${randomString}${path.extname(file.originalname)}`;
    
//     // Define staging file path
//     const filePath = `staging/profileImages/${userId}/${fileName}`;

//     console.log('Processing upload:', { fileName, filePath });

//     try {
//       // Upload to Firebase
//       const fileRef = bucket.file(filePath);

//       // Create write stream
//       const writeStream = fileRef.createWriteStream({
//         metadata: {
//           contentType: file.mimetype,
//           metadata: {
//             originalName: file.originalname,
//             uploadedAt: new Date().toISOString(),
//             userId: userId
//           }
//         }
//       });

//       // Handle upload completion
//       await new Promise((resolve, reject) => {
//         writeStream.on('finish', resolve);
//         writeStream.on('error', reject);
//         writeStream.end(file.buffer);
//       });

//       // Generate signed URL for verification
//       const [exists] = await fileRef.exists();
//       if (!exists) {
//         throw new Error('File upload verification failed');
//       }

//       const response = {
//         success: true,
//         fileName: fileName,
//         filePath: filePath, // Add this field
//         contentType: file.mimetype
//       };

//       console.log('Upload successful, sending response:', response);
//       res.json(response);

//     } catch (uploadError) {
//       console.error('Firebase upload error:', uploadError);
//       throw uploadError;
//     }

//   } catch (error: any) {
//     console.error('Upload error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Upload failed',
//       error: error.message 
//     });
//   }
// }

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


// static async uploadImage(req: Request, res: Response) {
//   try {
//     const userId = req.params.userId;
//     const file = req.file;

//     if (!file) {
//       return res.status(400).json({ success: false, message: 'No file uploaded' });
//     }

//     // Generate unique filename
//     const timestamp = Date.now();
//     const randomString = Math.random().toString(36).substring(2, 8);
//     const fileName = `${timestamp}-${randomString}${path.extname(file.originalname)}`;
    
//     // Upload to staging area
//     const filePath = `staging/profileImages/${userId}/${fileName}`;
//     const bucket = storage.bucket();
//     const fileRef = bucket.file(filePath);

//     // Create write stream with metadata
//     const writeStream = fileRef.createWriteStream({
//       metadata: {
//         contentType: file.mimetype,
//         metadata: {
//           originalName: file.originalname,
//           uploadedAt: new Date().toISOString()
//         }
//       }
//     });

//     // Handle upload completion
//     await new Promise((resolve, reject) => {
//       writeStream.on('finish', resolve);
//       writeStream.on('error', reject);
//       writeStream.end(file.buffer);
//     });

//     // Return success with file info
//     res.json({
//       success: true,
//       fileName,
//       filePath,
//       contentType: file.mimetype
//     });

//   } catch (error) {
//     console.error('Upload error:', error);
//     res.status(500).json({ success: false, message: 'Upload failed' });
//   }
// }
// }



// Controller method to handle file upload
// export async function uploadImage(req: Request, res: Response) {
//   try {
//     const userId = req.params.userId;
//     const file = req.file;

//     // Verify user has permission
//     if (req.user?.userId !== userId) {
//       return res.status(403).json({ error: 'Unauthorized' });
//     }

//     if (!file) {
//       return res.status(400).json({ success: false, message: 'No file uploaded' });
//     }

//     // Construct the file path
//     const fileExtension = path.extname(file.originalname);
//     const uniqueFileName = `${uuidv4()}${fileExtension}`;
//     const filePath = `staging/profileImages/${userId}/${uniqueFileName}`;

//     // Upload the file to Firebase Storage
//     const downloadURL = await uploadFileToFirebase(file.buffer, filePath, file.mimetype);

//     res.json({ success: true, downloadURL, fileName: uniqueFileName });
//   } catch (error) {
//     console.error('Error uploading file:', error);
//     res.status(500).json({ success: false, message: 'Error uploading file' });
//   }
// }




