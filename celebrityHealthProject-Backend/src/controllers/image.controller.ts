// import { Request, Response } from 'express';
// import { generateUploadUrl, deleteImageFromFirebase } from '../utils/firebase.utils';
// import { User } from '../models/user';
// import { RequestWithUser } from '../types/custom';


// export class ImageController {
//   // Generate signed URL for upload
//   // static async getUploadUrl(req: RequestWithUser, res: Response) {
//   //   try {
//   //       const userId = req.user?.userId;
//   //       console.log('User ID:!!!!!!!!!!!!!!!!!!!!!!', userId);
//   //       if (!userId) {
//   //           return res.status(401).json({ error: 'User not authenticated' });
//   //       }

//   //     const contentType = req.body.contentType;
//   //     const fileName = `${userId}-${Date.now()}.${contentType.split('/')[1]}`;
      
//   //     const signedUrl = await generateUploadUrl(userId, fileName, contentType);
      
//   //     res.json({ 
//   //       uploadUrl: signedUrl,
//   //       fileName: fileName,
//   //       fullPath: `profileImages/${userId}/${fileName}`
//   //     });
//   //   } catch (error) {
//   //     console.error('Error generating upload URL:', error);
//   //     res.status(500).json({ error: 'Failed to generate upload URL' });
//   //   }
//   // }
//   export async function getUploadUrl(req: Request, res: Response) {
//     try {
//       const { userId, fileName, contentType, folder } = req.body;
  
//       if (!userId || !fileName || !contentType) {
//         return res.status(400).json({ error: 'Missing required fields' });
//       }
  
//       // Verify the user has permission to upload
//       if (!req.user || req.user.userId !== userId) {
//         return res.status(403).json({ error: 'Unauthorized' });
//       }
  
//       const uploadUrl = await generateUploadUrl(
//         userId,
//         `${folder}/${fileName}`,
//         contentType
//       );
  
//       // Generate the eventual download URL
//       const downloadUrl = `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${folder}/${fileName}`;
  
//       res.json({
//         uploadUrl,
//         downloadUrl,
//         fileName,
//         fullPath: `${folder}/${fileName}`
//       });
//     } catch (error) {
//       console.error('Error generating upload URL:', error);
//       res.status(500).json({ error: 'Failed to generate upload URL' });
//     }
//   }
  

//   // Update user's profile picture
//   static async updateProfilePicture(req: Request, res: Response) {
//     try {
//       const userId = req.params.userId;
//       const { imageUrl, profilePictureSettings } = req.body;

//       if (!userId) {
//         return res.status(401).json({ error: 'User not authenticated' });
//     }

//       const user = await User.findByPk(userId);
//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }

//       // Update user
//       await user.update({
//         imgUrl: imageUrl,
//         profilePictureSettings: profilePictureSettings
//       });

//       res.json({
//         success: true,
//         user: user
//       });
//     } catch (error) {
//       console.error('Error updating profile picture:', error);
//       res.status(500).json({ error: 'Failed to update profile picture' });
//     }
//   }

//   // Delete profile picture
//   static async deleteProfilePicture(req: Request, res: Response) {
//     try {
//       const userId = req.params.userId;
//       if (!userId) {
//         return res.status(401).json({ error: 'User not authenticated' });
//     }
      
//       const user = await User.findByPk(userId);
//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }

//       if (user.imgUrl) {
//         await deleteImageFromFirebase(user.imgUrl);
//       }

//       await user.update({
//         imgUrl: null,
//         profilePictureSettings: null
//       });

//       res.json({
//         success: true,
//         message: 'Profile picture deleted successfully'
//       });
//     } catch (error) {
//       console.error('Error deleting profile picture:', error);
//       res.status(500).json({ error: 'Failed to delete profile picture' });
//     }
//   }
// }

import { Request, Response } from 'express';
import { generateUploadUrl, deleteImageFromFirebase } from '../utils/firebase.utils';
import { User } from '../models/user';
// import { RequestWithUser } from '../types/custom';
import path from 'path';
import { uploadFileToFirebase } from './storage.controller';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../config/firebase.config'; // Adjust the path as needed

export class ImageController {
  // Generate signed URL for upload
  // static async getUploadUrl(req: RequestWithUser, res: Response) {
  //   try {
  //     const { userId, fileName, contentType, folder } = req.body;

  //     if (!userId || !fileName || !contentType) {
  //       return res.status(400).json({ error: 'Missing required fields' });
  //     }

  //     // Verify the user has permission to upload
  //     if (!req.user || req.user.userId !== userId) {
  //       return res.status(403).json({ error: 'Unauthorized' });
  //     }

  //     const uploadUrl = await generateUploadUrl(
  //       userId,
  //       `${folder}/${fileName}`,
  //       contentType
  //     );

  //     // Generate the eventual download URL
  //     const downloadUrl = `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${folder}/${fileName}`;

  //     res.json({
  //       uploadUrl,
  //       downloadUrl,
  //       fileName,
  //       fullPath: `${folder}/${fileName}`
  //     });
  //   } catch (error) {
  //     console.error('Error generating upload URL:', error);
  //     res.status(500).json({ error: 'Failed to generate upload URL' });
  //   }
  // }
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

  // static async getStagingDownloadUrl(req: Request, res: Response) {
  //   try {
  //     const { userId } = req.params;
  //     const { fileName } = req.body;

  //     const filePath = `staging/profileImages/${userId}/${fileName}`;
  //     const bucket = storage.bucket();
  //     const file = bucket.file(filePath);

  //     // Generate signed URL
  //     const [downloadUrl] = await file.getSignedUrl({
  //       action: 'read',
  //       expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  //     });

  //     res.json({
  //       success: true,
  //       downloadUrl,
  //     });
  //   } catch (error) {
  //     console.error('Error generating staging download URL:', error);
  //     res.status(500).json({
  //       success: false,
  //       message: 'Failed to generate staging download URL',
  //     });
  //   }
  // }

}


// Controller method to handle file upload
export async function uploadImage(req: Request, res: Response) {
  try {
    const userId = req.params.userId;
    const file = req.file;

    // Verify user has permission
    if (req.user?.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Construct the file path
    const fileExtension = path.extname(file.originalname);
    const uniqueFileName = `${uuidv4()}${fileExtension}`;
    const filePath = `staging/profileImages/${userId}/${uniqueFileName}`;

    // Upload the file to Firebase Storage
    const downloadURL = await uploadFileToFirebase(file.buffer, filePath, file.mimetype);

    res.json({ success: true, downloadURL, fileName: uniqueFileName });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ success: false, message: 'Error uploading file' });
  }
}


