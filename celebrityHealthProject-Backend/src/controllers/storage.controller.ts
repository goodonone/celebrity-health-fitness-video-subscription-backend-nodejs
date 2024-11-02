// // src/controllers/storage.controller.ts
// import { Request, Response } from 'express';
// import { storage } from '../config/firebase.config';
// import { getDownloadURL } from 'firebase-admin/storage';

// export async function getImage(req: Request, res: Response) {
//   console.log('Get image request:', {
//     params: req.params,
//     url: req.url,
//     originalUrl: req.originalUrl
//   });

//   try {
//     const { userId, fileName } = req.params;
//     const filePath = `profileImages/${userId}/${fileName}`;
    
//     console.log('Attempting to serve:', filePath);
    
//     const fileRef = storage.bucket().file(filePath);
//     const [exists] = await fileRef.exists();
    
//     if (!exists) {
//       console.log('File not found:', filePath);
//       return res.status(404).send('Image not found');
//     }

//     // Get content type from metadata
//     const [metadata] = await fileRef.getMetadata();
//     const contentType = metadata.contentType || 'image/jpeg';

//     // Set appropriate headers
//     res.setHeader('Content-Type', contentType);
//     res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour

//     // Create read stream
//     const stream = fileRef.createReadStream();

//     // Handle stream errors
//     stream.on('error', (error) => {
//       console.error('Stream error:', error);
//       if (!res.headersSent) {
//         res.status(500).send('Error streaming image');
//       }
//     });

//     // Pipe the stream to response
//     stream.pipe(res);

//   } catch (error) {
//     console.error('Error serving image:', error);
//     if (!res.headersSent) {
//       res.status(500).send('Error serving image');
//     }
//   }
// }


// export function generateProxyUrl(req: Request, filePath: string): string {
//   const baseUrl = process.env.API_BASE_URL || `${req.protocol}://${req.get('host')}`;
//   return `${baseUrl}/api/storage/${encodeURIComponent(filePath)}`;
// }

// src/controllers/storage.controller.ts
import { Request, Response } from 'express';
import { storage } from '../config/firebase.config';
import { getDownloadURL } from 'firebase-admin/storage';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import multer from 'multer';
// import { RequestWithUser } from '../types/custom';

// At the top of storage.controller.ts
// interface AuthenticatedRequest extends Request {
//   user?: {
//     uid: string;
//     [key: string]: any;
//   }
// }

export async function getImage(req: Request, res: Response) {
  console.log('Get image request:', {
    params: req.params,
    url: req.url,
    originalUrl: req.originalUrl
  });

  try {
    const { userId, fileName } = req.params;
    const isStaged = req.path.includes('/staging/');
    
    // Construct the appropriate file path
    const pathPrefix = isStaged ? 'staging/' : '';
    const filePath = `${pathPrefix}profileImages/${userId}/${fileName}`;
    
    console.log('Attempting to serve:', filePath);
    
    // For staged images, verify user has permission
    if (isStaged) {
      const authenticatedUserId = req.user?.uid; // From auth middleware
      if (!authenticatedUserId || authenticatedUserId !== userId) {
        console.log('Unauthorized staged image access:', {
          authenticatedUserId,
          requestedUserId: userId
        });
        return res.status(403).json({
          error: 'Unauthorized access to staged image'
        });
      }
    }
    
    const fileRef = storage.bucket().file(filePath);
    const [exists] = await fileRef.exists();
    
    if (!exists) {
      console.log('File not found:', filePath);
      return res.status(404).send('Image not found');
    }

    // Get content type from metadata
    const [metadata] = await fileRef.getMetadata();
    const contentType = metadata.contentType || 'image/jpeg';

    // Set appropriate headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', isStaged ? 'no-cache' : 'public, max-age=3600');

    // Create read stream
    const stream = fileRef.createReadStream();

    // Handle stream errors
    stream.on('error', (error) => {
      console.error('Stream error:', error);
      if (!res.headersSent) {
        res.status(500).send('Error streaming image');
      }
    });

    // Pipe the stream to response
    stream.pipe(res);

  } catch (error) {
    console.error('Error serving image:', error);
    if (!res.headersSent) {
      res.status(500).send('Error serving image');
    }
  }
}

export function generateProxyUrl(req: Request, filePath: string, isStaged: boolean = false): string {
  const baseUrl = process.env.API_BASE_URL || `${req.protocol}://${req.get('host')}`;
  const pathPrefix = isStaged ? 'staging/' : '';
  const fullPath = `${pathPrefix}${filePath}`;
  return `${baseUrl}/api/storage/${encodeURIComponent(fullPath)}`;
}

// Helper function to clean up staged images
export async function deleteStageImage(userId: string, fileName: string): Promise<void> {
  try {
    const filePath = `staging/profileImages/${userId}/${fileName}`;
    const fileRef = storage.bucket().file(filePath);
    
    const [exists] = await fileRef.exists();
    if (exists) {
      await fileRef.delete();
      console.log('Staged image deleted:', filePath);
    }
  } catch (error) {
    console.error('Error deleting staged image:', error);
    throw error;
  }
}

// Helper function to move staged image to permanent storage
export async function moveToPermStorage(userId: string, fileName: string): Promise<string> {
  try {
    const stagingPath = `staging/profileImages/${userId}/${fileName}`;
    const permanentPath = `profileImages/${userId}/${fileName}`;
    
    const stagingRef = storage.bucket().file(stagingPath);
    const permanentRef = storage.bucket().file(permanentPath);
    
    // Check if staged file exists
    const [exists] = await stagingRef.exists();
    if (!exists) {
      throw new Error('Staged image not found');
    }
    
    // Copy the file to permanent location
    await stagingRef.copy(permanentRef);
    
    // Delete the staged file
    await stagingRef.delete();
    
    // Get the download URL for the permanent file
    const downloadURL = await getDownloadURL(permanentRef);
    
    console.log('Image moved to permanent storage:', {
      from: stagingPath,
      to: permanentPath
    });
    
    return downloadURL;
  } catch (error) {
    console.error('Error moving staged image:', error);
    throw error;
  }
}

  // storage.controller.ts
export async function moveImage(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const { fileName } = req.body;

    // Verify user has permission
    if (req.user?.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const bucket = storage.bucket();
    const stagingPath = `staging/profileImages/${userId}/${fileName}`;
    const permanentPath = `profileImages/${userId}/${fileName}`;
    
    // Move file from staging to permanent
    await bucket.file(stagingPath).move(bucket.file(permanentPath));

    // Generate signed URL for the permanent file
    const [url] = await bucket.file(permanentPath).getSignedUrl({
      action: 'read',
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    });

    res.json({ url });
  } catch (error) {
    console.error('Error moving image:', error);
    res.status(500).json({ error: 'Failed to move image' });
  }
}

// Function to upload file to Firebase Storage
// export async function uploadFileToFirebase(
//   fileBuffer: Buffer,
//   filePath: string,
//   contentType: string
// ): Promise<string> {
//   try {
//     const bucket = storage.bucket();
//     const file = bucket.file(filePath);

//     await file.save(fileBuffer, {
//       metadata: { contentType },
//     });

//     // Optionally make the file publicly accessible
//     // await file.makePublic();

//     // Generate a signed URL for the uploaded file
//     const [downloadURL] = await file.getSignedUrl({
//       action: 'read',
//       expires: '03-17-2025', // Adjust as needed
//     });

//     return downloadURL;
//   } catch (error) {
//     console.error('Error uploading file to Firebase:', error);
//     throw error;
//   }
// }

// // Initialize multer middleware
// const upload = multer();


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

export async function uploadFileToFirebase(
  fileBuffer: Buffer,
  filePath: string,
  contentType: string
): Promise<string> {
  try {
    const bucket = storage.bucket();
    const file = bucket.file(filePath);

    await file.save(fileBuffer, {
      metadata: { contentType },
    });

    // Optionally make the file publicly accessible
    // await file.makePublic();

    // Generate a signed URL for the uploaded file
    const [downloadURL] = await file.getSignedUrl({
      action: 'read',
      expires: '03-17-2025', // Adjust as needed
    });

    return downloadURL;
  } catch (error) {
    console.error('Error uploading file to Firebase:', error);
    throw error;
  }
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

