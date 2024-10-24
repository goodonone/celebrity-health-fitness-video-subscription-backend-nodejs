import { Request, Response } from 'express';
import { generateUploadUrl, deleteImageFromFirebase } from '../utils/firebase.utils';
import { User } from '../models/user';
import { RequestWithUser } from '../types/custom';


export class ImageController {
  // Generate signed URL for upload
  static async getUploadUrl(req: RequestWithUser, res: Response) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

      const contentType = req.body.contentType;
      const fileName = `${userId}-${Date.now()}.${contentType.split('/')[1]}`;
      
      const signedUrl = await generateUploadUrl(fileName, contentType);
      
      res.json({ 
        uploadUrl: signedUrl,
        fileName: fileName,
        fullPath: `profileImages/${fileName}`
      });
    } catch (error) {
      console.error('Error generating upload URL:', error);
      res.status(500).json({ error: 'Failed to generate upload URL' });
    }
  }

  // Update user's profile picture
  static async updateProfilePicture(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const { imageUrl, profilePictureSettings } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Update user
      await user.update({
        imgUrl: imageUrl,
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
}