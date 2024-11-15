import { Request, Response } from 'express';
import { storage } from '../config/firebase.config';
import { getDownloadURL } from 'firebase-admin/storage';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import multer from 'multer';
import { verifyTokenString } from '../services/auth';
import jwt from 'jsonwebtoken';
// import { RequestWithUser } from '../types/custom';
import dotenv from 'dotenv';
import * as admin from 'firebase-admin';

interface MoveImageResponse {
  success: boolean;
  url?: string;
  error?: string;
}

dotenv.config();


// Get and validate JWT secret at startup
const secret = process.env.JWT_SECRET;
if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}


export async function getImage(req: Request, res: Response) {
  try {
    const filePath = req.params[0]; // Extract the file path from the wildcard route

    // Construct full file path
    const isStaged = filePath.startsWith('staging/');
    const storageFilePath = isStaged ? filePath : `profileImages/${filePath}`;

    const fileRef = storage.bucket().file(storageFilePath);
    const [exists] = await fileRef.exists();

    if (!exists) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Stream the file to the response
    const readStream = fileRef.createReadStream();

    // Set appropriate headers
    res.setHeader('Content-Type', 'image/jpeg'); // Adjust based on file type

    // Pipe the read stream to the response
    readStream.pipe(res).on('error', (err) => {
      console.error('Error reading file:', err);
      res.status(500).send('Internal Server Error');
    });
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// export async function generateShortImageUrl(userId: string, fileName: string): Promise<string> {
//   // Create a shortened URL format that will be stored in the database
//   return `/api/storage/profileImages/${userId}/${fileName}`;
// }

// export function generateProxyUrl(req: Request, filePath: string, isStaged: boolean = false): string {
//   const baseUrl = process.env.API_BASE_URL || `${req.protocol}://${req.get('host')}`;
//   const pathPrefix = isStaged ? 'staging/' : '';
//   const fullPath = `${pathPrefix}${filePath}`;
//   return `${baseUrl}/api/storage/${encodeURIComponent(fullPath)}`;
// }

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

export async function uploadImage(req: Request, res: Response) {
  try {
    const userId = req.params.userId;
    const file = req.file;

    console.log('Upload request received:', {
      userId,
      fileName: file?.originalname,
      contentType: file?.mimetype
    });

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Generate filename and paths
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileName = `${timestamp}-${randomString}${path.extname(file.originalname)}`;
    const filePath = `staging/profileImages/${userId}/${fileName}`;

    console.log('Generated file info:', {
      fileName,
      filePath
    });

    const bucket = storage.bucket();
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
      throw new Error('Upload verification failed');
    }

    console.log('Upload successful:', {
      path: filePath,
      verified: exists
    });

    res.json({
      success: true,
      fileName,
      filePath,
      contentType: file.mimetype
    });

  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    });
  }
}

export async function moveImage(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const { fileName } = req.body;

    // Initial request logging
    console.log('Move request received:', {
      userId,
      fileName,
      body: req.body
    });

    if (!fileName) {
      return res.status(400).json({
        success: false,
        error: 'Filename is required'
      });
    }

    const bucket = storage.bucket();
    // const stagingPath = `staging/profileImages/${userId}/${fileName}`;
    // const permanentPath = `profileImages/${userId}/${fileName}`;
    const stagingPath = `staging/profileImages/${userId}/${fileName}`.replace(/^\/+/, '');
    const permanentPath = `profileImages/${userId}/${fileName}`.replace(/^\/+/, '');

    // Debug: List all files in staging directory
    const [files] = await bucket.getFiles({
      prefix: `staging/profileImages/${userId}/`
    });

    console.log('Files in staging directory:', {
      stagingPath,
      existingFiles: files.map(f => f.name)
    });

    // Check staging file exists
    const [stagingExists] = await bucket.file(stagingPath).exists();
    console.log('Staging file exists:', {
      path: stagingPath,
      exists: stagingExists
    });

    if (!stagingExists) {
      // Try alternative path without leading slash
      const altStagingPath = stagingPath.startsWith('/') ? stagingPath.substring(1) : `/${stagingPath}`;
      const [altExists] = await bucket.file(altStagingPath).exists();
      
      console.log('Checking alternative path:', {
        path: altStagingPath,
        exists: altExists
      });

      if (!altExists) {
        return res.status(404).json({
          success: false,
          error: 'Staged file not found',
          details: {
            triedPaths: [stagingPath, altStagingPath],
            availableFiles: files.map(f => f.name)
          }
        });
      }
    }

    try {
      // Check and clean destination
      const [destExists] = await bucket.file(permanentPath).exists();
      if (destExists) {
        console.log('Deleting existing file:', permanentPath);
        await bucket.file(permanentPath).delete();
      }

      // Perform move operation
      console.log('Moving file:', {
        from: stagingPath,
        to: permanentPath
      });

      await bucket.file(stagingPath).move(permanentPath);

      // Verify move was successful
      const [movedExists] = await bucket.file(permanentPath).exists();
      if (!movedExists) {
        throw new Error('Move verification failed');
      }

      console.log('Move successful');

      // Return success response with all necessary information
      res.json({
        success: true,
        fileName,
        filePath: permanentPath,
        metadata: {
          moved: true,
          originalPath: stagingPath,
          finalPath: permanentPath,
          timestamp: new Date().toISOString()
        }
      });

    } catch (moveError) {
      console.error('Move operation failed:', moveError);

      // Cleanup attempt
      try {
        const [destExists] = await bucket.file(permanentPath).exists();
        if (destExists) {
          console.log('Cleaning up failed move - deleting destination file');
          await bucket.file(permanentPath).delete();
        }
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }

      throw moveError;
    }

  } catch (error: any) {
    console.error('Request handling error:', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      error: 'Failed to move file',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? {
        errorType: error.name,
        errorMessage: error.message,
        stack: error.stack
      } : undefined
    });
  }
}

export const getStorageFile = async (req: Request, res: Response) => {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Handle preflight
    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }

    // Check if path requires auth (staging paths always require auth)
    const path = req.path.replace(/^\/storage\//, '').replace(/^\/+/, '');
    const requiresAuth = path.startsWith('staging/');

    // Verify auth for paths that require it
    if (requiresAuth) {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      try {
        await verifyTokenString(authHeader.split(' ')[1]);
      } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
      }
    }

    // Get file from storage
    const bucket = storage.bucket();
    const file = bucket.file(path);

    // Check if file exists
    const [exists] = await file.exists();
    if (!exists) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Get metadata and set headers
    const [metadata] = await file.getMetadata();
    res.setHeader('Content-Type', metadata.contentType || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=3600');

    // Stream file
    const readStream = file.createReadStream();
    readStream.on('error', (error) => {
      console.error('Streaming error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Error streaming file' });
      }
    });

    readStream.pipe(res);

  } catch (error) {
    console.error('Error serving file:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

interface CleanupResult {
  success: boolean;
  deletedFiles: string[];
  errors?: string[];
}

// export async function cleanupStagedFiles(req: Request, res: Response) {
//   const userId = req.params.userId;
//   const errors: string[] = [];
//   const deletedFiles: string[] = [];

//   try {
//     console.log('Starting cleanup for user:', userId);

//     const bucket = storage.bucket();
//     const stagingPrefix = `staging/profileImages/${userId}/`;

//     // List all files in user's staging directory
//     const [files] = await bucket.getFiles({ prefix: stagingPrefix });
    
//     console.log('Found staged files:', files.map(f => f.name));

//     // Delete each staged file
//     for (const file of files) {
//       try {
//         await file.delete();
//         deletedFiles.push(file.name);
//         console.log('Deleted staged file:', file.name);
//       } catch (error: any) {
//         console.error('Error deleting file:', file.name, error);
//         errors.push(`Failed to delete ${file.name}: ${error.message}`);
//       }
//     }

//     // Return success even if some files failed to delete
//     res.json({
//       success: true,
//       deletedFiles,
//       ...(errors.length && { errors })
//     });

//   } catch (error: any) {
//     console.error('Cleanup error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Cleanup failed',
//       message: error.message,
//       deletedFiles,
//       errors
//     });
//   }
// }

// storage.controller.ts

// storage.controller.ts

export async function cleanupStagedFiles(req: Request, res: Response) {
  try {
    const userId = req.params.userId;
    console.log('Received cleanup request for userId:', userId);

    const bucket = storage.bucket();
    const stagingPrefix = `staging/profileImages/${userId}/`;

    // List all files in staging
    const [files] = await bucket.getFiles({ prefix: stagingPrefix });
    console.log('Found staged files:', files.map(f => f.name));

    if (files.length === 0) {
      return res.json({
        success: true,
        message: 'No staged files found',
        deletedFiles: []
      });
    }

    // Delete all staged files
    const deletePromises = files.map(async file => {
      try {
        await file.delete();
        return { 
          success: true, 
          file: file.name 
        };
      } catch (error: any) {
        console.error(`Failed to delete ${file.name}:`, error);
        return { 
          success: false, 
          file: file.name, 
          error: error.message 
        };
      }
    });

    const results = await Promise.all(deletePromises);

    const response = {
      success: true,
      deletedFiles: results.filter(r => r.success).map(r => r.file),
      errors: results.filter(r => !r.success)
    };

    console.log('Cleanup completed:', response);
    res.json(response);

  } catch (error: any) {
    console.error('Cleanup error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cleanup staged files',
      message: error.message
    });
  }
}

// export async function cleanupStagedFiles(req: Request, res: Response) {
//   const userId = req.params.userId;
//   console.log('Received cleanup request for userId:', userId);

//   try {
//     const bucket = storage.bucket();
//     const stagingPrefix = `staging/profileImages/${userId}/`;

//     // List all files in staging
//     const [files] = await bucket.getFiles({ prefix: stagingPrefix });
//     console.log('Found staged files:', files.map(f => f.name));

//     if (files.length === 0) {
//       return res.json({
//         success: true,
//         message: 'No staged files found',
//         deletedFiles: []
//       });
//     }

//     // Delete all staged files
//     const deleteResults = await Promise.allSettled(
//       files.map(async (file) => {
//         try {
//           await file.delete();
//           return { file: file.name, success: true };
//         } catch (error) {
//           console.error(`Failed to delete ${file.name}:`, error);
//           return { file: file.name, success: false, error };
//         }
//       })
//     );

//     const results = {
//       success: true,
//       deletedFiles: deleteResults
//         .filter(result => result.status === 'fulfilled' && result.value.success)
//         .map(result => (result as PromiseFulfilledResult<any>).value.file),
//       errors: deleteResults
//         .filter(result => result.status === 'rejected' || !result.value.success)
//         .map(result => {
//           if (result.status === 'rejected') {
//             return result.reason;
//           }
//           return (result as PromiseFulfilledResult<any>).value.error;
//         })
//     };

//     console.log('Cleanup completed:', results);
//     res.json(results);

//   } catch (error: any) {
//     console.error('Cleanup error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Cleanup failed',
//       message: error.message
//     });
//   }
// }