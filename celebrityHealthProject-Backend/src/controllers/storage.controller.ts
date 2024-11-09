

// At the top of storage.controller.ts
// interface AuthenticatedRequest extends Request {
//   user?: {
//     uid: string;
//     [key: string]: any;
//   }
// }

// export async function getImage(req: Request, res: Response) {
//   console.log('Get image request:', {
//     params: req.params,
//     url: req.url,
//     originalUrl: req.originalUrl
//   });

//   try {
//     const { userId, fileName } = req.params;
//     const isStaged = req.path.includes('/staging/');
    
//     // Construct the appropriate file path
//     const pathPrefix = isStaged ? 'staging/' : '';
//     const filePath = `${pathPrefix}profileImages/${userId}/${fileName}`;
    
//     console.log('Attempting to serve:', filePath);
    
//     // For staged images, verify user has permission
//     if (isStaged) {
//       const authenticatedUserId = req.user?.uid; // From auth middleware
//       if (!authenticatedUserId || authenticatedUserId !== userId) {
//         console.log('Unauthorized staged image access:', {
//           authenticatedUserId,
//           requestedUserId: userId
//         });
//         return res.status(403).json({
//           error: 'Unauthorized access to staged image'
//         });
//       }
//     }
    
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
//     res.setHeader('Cache-Control', isStaged ? 'no-cache' : 'public, max-age=3600');

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

// export async function getImage(req: Request, res: Response) {
//   console.log('Get image request:', {
//     params: req.params,
//     url: req.url,
//     originalUrl: req.originalUrl
//   });

//   try {
//     const { userId, fileName } = req.params;
//     const isStaged = req.path.includes('/staging/');
    
//     // Get token from query params or auth header
//     // const token = (Array.isArray(req.query.token) ? req.query.token[0] : req.query.token) || 
//     //              req.headers.authorization?.replace('Bearer ', '');

//     // Get token with proper type handling
//     // Get token with proper type handling
//     let tokenValue: string | undefined;
//     const queryToken = req.query.token;

//     if (Array.isArray(queryToken)) {
//       tokenValue = queryToken[0]?.toString();
//     } else if (queryToken) {
//       tokenValue = queryToken.toString();
//     } else {
//       tokenValue = req.headers.authorization?.replace('Bearer ', '');
//     }

//     if (isStaged) {
//       if (!tokenValue) {
//         console.log('No authentication token provided for staged image');
//         return res.status(401).json({ error: 'Authentication required' });
//       }

//       try {
//         const decoded = await verifyTokenString(tokenValue);
//         if (!decoded) {
//           return res.status(401).json({ error: 'Invalid token' });
//         }
        
//         if (decoded.userId !== userId) {
//           console.log('Token user ID mismatch:', {
//             tokenUserId: decoded.userId,
//             requestedUserId: userId
//           });
//           return res.status(403).json({ error: 'Unauthorized access' });
//         }
//       } catch (error) {
//         console.error('Token verification failed:', error);
//         return res.status(401).json({ error: 'Invalid token' });
//       }
//     }

//     // Construct file path
//     const pathPrefix = isStaged ? 'staging/' : '';
//     const filePath = `${pathPrefix}profileImages/${userId}/${fileName}`;
//     console.log('Serving file:', filePath);

//     // Get file reference and check existence
//     const fileRef = storage.bucket().file(filePath);
//     const [exists] = await fileRef.exists();
    
//     if (!exists) {
//       console.log('File not found:', filePath);
//       return res.status(404).json({ error: 'Image not found' });
//     }

//     // Get and set content type
//     const [metadata] = await fileRef.getMetadata();
//     const contentType = metadata.contentType || 'image/jpeg';
//     res.setHeader('Content-Type', contentType);

//     // Set caching headers
//     const cacheControl = isStaged ? 'no-cache, no-store, must-revalidate' : 'public, max-age=3600';
//     res.setHeader('Cache-Control', cacheControl);
//     if (isStaged) {
//       res.setHeader('Pragma', 'no-cache');
//       res.setHeader('Expires', '0');
//     }

//     // Create read stream with error handling
//     const stream = fileRef.createReadStream()
//       .on('error', (error) => {
//         console.error('Stream error:', error);
//         if (!res.headersSent) {
//           res.status(500).json({ error: 'Error streaming image' });
//         }
//       });

//     // Pipe stream to response
//     stream.pipe(res);

//   } catch (error) {
//     console.error('Error serving image:', error);
//     if (!res.headersSent) {
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }
// }

// export async function getImage(req: Request, res: Response) {
//   try {
//     const { userId, fileName } = req.params;
//     const isStaged = req.path.includes('/staging/');
    
//     // Get token from query params
//     const token = req.query.token?.toString();

//     if (isStaged) {
//       // For staged images, require authentication
//       if (!token) {
//         return res.status(401).json({ error: 'Authentication required' });
//       }

//       try {
//         const decoded = await verifyTokenString(token);
//         if (!decoded || decoded.userId !== userId) {
//           return res.status(403).json({ error: 'Unauthorized access' });
//         }
//       } catch (error) {
//         return res.status(401).json({ error: 'Invalid token' });
//       }
//     }

//     // Construct file path
//     const pathPrefix = isStaged ? 'staging/' : '';
//     const filePath = `${pathPrefix}profileImages/${userId}/${fileName}`;

//     // Get file reference
//     const fileRef = storage.bucket().file(filePath);
//     const [exists] = await fileRef.exists();
    
//     if (!exists) {
//       return res.status(404).json({ error: 'Image not found' });
//     }

//     // Generate a signed URL for the image
//     const [signedUrl] = await fileRef.getSignedUrl({
//       action: 'read',
//       expires: Date.now() + (isStaged ? 15 * 60 * 1000 : 24 * 60 * 60 * 1000), // 15 mins for staged, 24 hours for permanent
//     });

//     // Redirect to the signed URL instead of streaming
//     res.redirect(signedUrl);

//   } catch (error) {
//     console.error('Error serving image:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// }


// export async function moveImage(req: Request, res: Response) {
//   try {
//     const { userId } = req.params;
//     const { fileName } = req.body;

//     if (!fileName) {
//       return res.status(400).json({
//         success: false,
//         error: 'Filename is required'
//       });
//     }

//     const bucket = storage.bucket();
//     const stagingPath = `staging/profileImages/${userId}/${fileName}`;
//     const permanentPath = `profileImages/${userId}/${fileName}`;

//     // Check if staging file exists
//     const [stagingExists] = await bucket.file(stagingPath).exists();
//     if (!stagingExists) {
//       return res.status(404).json({
//         success: false,
//         error: 'Staged file not found'
//       });
//     }

//     // Move file
//     await bucket.file(stagingPath).move(bucket.file(permanentPath));

//     // Generate a basic storage URL without query parameters
//     const baseUrl = `https://storage.googleapis.com/${bucket.name}/${permanentPath}`;

//     res.json({
//       success: true,
//       url: baseUrl  // Return the base URL without query parameters
//     });
//   } catch (error) {
//     console.error('Error moving image:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Failed to move image'
//     });
//   }
// }
// export async function moveImage(req: Request, res: Response) {
//   try {
//     const { userId } = req.params;
//     const { fileName } = req.body;

//     if (!fileName) {
//       return res.status(400).json({
//         success: false,
//         error: 'Filename is required'
//       });
//     }

//     const bucket = storage.bucket();
//     const stagingPath = `staging/profileImages/${userId}/${fileName}`;
//     const permanentPath = `profileImages/${userId}/${fileName}`;

//     // Check if staging file exists
//     const [stagingExists] = await bucket.file(stagingPath).exists();
//     if (!stagingExists) {
//       return res.status(404).json({
//         success: false,
//         error: 'Staged file not found'
//       });
//     }

//     // Move file
//     await bucket.file(stagingPath).move(bucket.file(permanentPath));

//     // Get the file reference
//     const permanentRef = bucket.file(permanentPath);
    
//     // Generate a signed URL with longer expiration for permanent files
//     const [signedUrl] = await permanentRef.getSignedUrl({
//       action: 'read',
//       expires: Date.now() + 1000 * 60 * 60 * 24 * 7 // 7 days
//     });

//     res.json({
//       success: true,
//       url: signedUrl
//     });
//   } catch (error) {
//     console.error('Error moving image:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Failed to move image'
//     });
//   }
// }

// export async function moveImage(req: Request, res: Response) {
//   try {
//     const { userId } = req.params;
//     const { fileName } = req.body;

//     if (!fileName) {
//       return res.status(400).json({
//         success: false,
//         error: 'Filename is required'
//       });
//     }

//     const bucket = storage.bucket();
//     const stagingPath = `staging/profileImages/${userId}/${fileName}`;
//     const permanentPath = `profileImages/${userId}/${fileName}`;

//     // Check if staging file exists
//     const [stagingExists] = await bucket.file(stagingPath).exists();
//     if (!stagingExists) {
//       return res.status(404).json({
//         success: false,
//         error: 'Staged file not found'
//       });
//     }

//     // Move file
//     await bucket.file(stagingPath).move(bucket.file(permanentPath));

//     // Generate a shorter URL for database storage
//     const shortUrl = await generateShortImageUrl(userId, fileName);

//     res.json({
//       success: true,
//       url: shortUrl
//     });
//   } catch (error) {
//     console.error('Error moving image:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Failed to move image'
//     });
//   }
// }

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

// export async function getImage(req: Request, res: Response) {
//   try {
//     const { userId, fileName } = req.params;
    
//     if (!userId || !fileName) {
//       return res.status(400).json({ error: 'Missing required parameters' });
//     }

//     const isStaged = req.path.includes('/staging/');
    
//     // Get token from query params
//     const token = req.query.token?.toString();

//     if (isStaged) {
//       // For staged images, require authentication
//       if (!token) {
//         return res.status(401).json({ error: 'Authentication required' });
//       }

//       try {
//         const decoded = await verifyTokenString(token);
//         if (!decoded || decoded.userId !== userId) {
//           console.log('Token verification failed:', { 
//             decodedUserId: decoded?.userId, 
//             requestedUserId: userId 
//           });
//           return res.status(403).json({ error: 'Unauthorized access' });
//         }
//       } catch (error) {
//         console.error('Token verification error:', error);
//         return res.status(401).json({ error: 'Invalid token' });
//       }
//     }

//     // Construct file path
//     const pathPrefix = isStaged ? 'staging/' : '';
//     const filePath = `${pathPrefix}profileImages/${userId}/${fileName}`;

//     // Get file reference
//     const fileRef = storage.bucket().file(filePath);
//     const [exists] = await fileRef.exists();
    
//     if (!exists) {
//       console.log('File not found:', filePath);
//       return res.status(404).json({ error: 'Image not found' });
//     }

//     try {
//       // Generate a signed URL for the image
//       const [signedUrl] = await fileRef.getSignedUrl({
//         action: 'read',
//         expires: Date.now() + (isStaged ? 15 * 60 * 1000 : 24 * 60 * 60 * 1000), // 15 mins for staged, 24 hours for permanent
//       });

//       // Redirect to the signed URL
//       res.redirect(signedUrl);
//     } catch (signUrlError) {
//       console.error('Error generating signed URL:', signUrlError);
//       res.status(500).json({ error: 'Failed to generate image URL' });
//     }

//   } catch (error) {
//     console.error('Error serving image:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// }

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

// // Controller method to handle file upload
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
//     await uploadFileToFirebase(file.buffer, filePath, file.mimetype);

//     res.json({ success: true, fileName: uniqueFileName });
//   } catch (error) {
//     console.error('Error uploading file:', error);
//     res.status(500).json({ success: false, message: 'Error uploading file' });
//   }
// }
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



// export async function moveImage(req: Request, res: Response) {
//   try {
//     const { userId } = req.params;
//     const { fileName } = req.body;

//     if (!fileName) {
//       return res.status(400).json({
//         success: false,
//         error: 'Filename is required'
//       });
//     }

//     if (!userId) {
//       return res.status(400).json({
//         success: false,
//         error: 'UserId is required'
//       });
//     }

//     const bucket = storage.bucket();
//     const stagingPath = `staging/profileImages/${userId}/${fileName}`;
//     const permanentPath = `profileImages/${userId}/${fileName}`;

//     // Check if staging file exists
//     const [stagingExists] = await bucket.file(stagingPath).exists();
//     if (!stagingExists) {
//       return res.status(404).json({
//         success: false,
//         error: 'Staged file not found'
//       });
//     }

//     // Check if destination file already exists
//     const [destExists] = await bucket.file(permanentPath).exists();
//     if (destExists) {
//       // Delete existing file first
//       await bucket.file(permanentPath).delete();
//     }

//     try {
//       // Move file
//       await bucket.file(stagingPath).move(bucket.file(permanentPath));
      
//       // Generate a signed URL
//       const [signedUrl] = await bucket.file(permanentPath).getSignedUrl({
//         action: 'read',
//         expires: Date.now() + 1000 * 60 * 60 * 24 * 7 // 7 days
//       });

//       // Verify the move was successful
//       const [movedFileExists] = await bucket.file(permanentPath).exists();
//       if (!movedFileExists) {
//         throw new Error('File move verification failed');
//       }

//       res.json({
//         success: true,
//         // url: signedUrl,
//         fileName
//         // path: permanentPath
//       });
//     } catch (moveError) {
//       console.error('Error moving file:', moveError);
      
//       // Try to cleanup any partial moves
//       try {
//         const [destFileExists] = await bucket.file(permanentPath).exists();
//         if (destFileExists) {
//           await bucket.file(permanentPath).delete();
//         }
//       } catch (cleanupError) {
//         console.error('Error during cleanup:', cleanupError);
//       }

//       res.status(500).json({
//         success: false,
//         error: 'Failed to move file'
//       });
//     }
//   } catch (error) {
//     console.error('Error handling move request:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Internal server error'
//     });
//   }
// }

// export async function moveImage(req: Request, res: Response) {
//   try {
//     const { userId } = req.params;
//     const { fileName } = req.body;

//     // Input validation
//     if (!fileName || !userId) {
//       return res.status(400).json({
//         success: false,
//         error: 'Both userId and fileName are required'
//       });
//     }

//     const bucket = storage.bucket();
//     const stagingPath = `staging/profileImages/${userId}/${fileName}`;
//     const permanentPath = `profileImages/${userId}/${fileName}`;

//     // Check staging file exists
//     const [stagingExists] = await bucket.file(stagingPath).exists();
//     if (!stagingExists) {
//       return res.status(404).json({
//         success: false,
//         error: 'Staged file not found'
//       });
//     }

//     try {
//       // Handle existing file in destination
//       const [destExists] = await bucket.file(permanentPath).exists();
//       if (destExists) {
//         await bucket.file(permanentPath).delete();
//       }

//       // Move file
//       await bucket.file(stagingPath).move(bucket.file(permanentPath));

//       // Verify move was successful
//       const [movedFileExists] = await bucket.file(permanentPath).exists();
//       if (!movedFileExists) {
//         throw new Error('Move verification failed');
//       }

//       res.json({
//         success: true,
//         fileName,
//         path: permanentPath
//       });

//     } catch (moveError) {
//       console.error('Error during move operation:', moveError);
      
//       // Cleanup: check and remove any partial moves
//       try {
//         const [destExists] = await bucket.file(permanentPath).exists();
//         if (destExists) {
//           await bucket.file(permanentPath).delete();
//         }
//       } catch (cleanupError) {
//         console.error('Cleanup error after failed move:', cleanupError);
//       }

//       throw moveError; // Re-throw to be caught by outer catch
//     }

//   } catch (error: any) {
//     console.error('Move image error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Failed to move file',
//       details: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// }

// export async function moveImage(req: Request, res: Response) {
//   try {
//     const { userId } = req.params;
//     const { fileName } = req.body;

//     if (!fileName) {
//       return res.status(400).json({
//         success: false,
//         error: 'Filename is required'
//       });
//     }

//     const bucket = storage.bucket();
//     const stagingPath = `staging/profileImages/${userId}/${fileName}`;
//     const permanentPath = `profileImages/${userId}/${fileName}`;

//     // Check if staging file exists
//     const [stagingExists] = await bucket.file(stagingPath).exists();
//     if (!stagingExists) {
//       return res.status(404).json({
//         success: false,
//         error: 'Staged file not found'
//       });
//     }

//     // Check and delete any existing file in permanent location
//     const [destExists] = await bucket.file(permanentPath).exists();
//     if (destExists) {
//       await bucket.file(permanentPath).delete();
//     }

//     // Move file
//     await bucket.file(stagingPath).move(permanentPath);

//     // Verify move
//     const [movedExists] = await bucket.file(permanentPath).exists();
//     if (!movedExists) {
//       throw new Error('Move verification failed');
//     }

//     res.json({
//       success: true,
//       fileName,
//       filePath: permanentPath
//     });

//   } catch (error) {
//     console.error('Move error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Failed to move file'
//     });
//   }
// }

// export async function moveImage(req: Request, res: Response) {
//   try {
//     const { userId } = req.params;
//     const { fileName } = req.body;

//     console.log('Moving image:', { userId, fileName });

//     if (!fileName) {
//       return res.status(400).json({
//         success: false,
//         error: 'Filename is required'
//       });
//     }

//     const bucket = storage.bucket();
//     const stagingPath = `staging/profileImages/${userId}/${fileName}`;
//     const permanentPath = `profileImages/${userId}/${fileName}`;

//     console.log('Paths:', { stagingPath, permanentPath });

//     // Check staging file exists
//     const [stagingExists] = await bucket.file(stagingPath).exists();
//     if (!stagingExists) {
//       console.log('Staged file not found:', stagingPath);
//       return res.status(404).json({
//         success: false,
//         error: 'Staged file not found'
//       });
//     }

//     try {
//       // Check and handle existing file in destination
//       const [destExists] = await bucket.file(permanentPath).exists();
//       if (destExists) {
//         console.log('Deleting existing file:', permanentPath);
//         await bucket.file(permanentPath).delete();
//       }

//       // Move file
//       await bucket.file(stagingPath).move(bucket.file(permanentPath));

//       // Verify move was successful
//       const [movedFileExists] = await bucket.file(permanentPath).exists();
//       if (!movedFileExists) {
//         throw new Error('Move verification failed');
//       }

//       console.log('Move successful:', { 
//         from: stagingPath, 
//         to: permanentPath 
//       });

//       // Return success with all required fields
//       res.json({
//         success: true,
//         fileName,
//         filePath: permanentPath
//       });

//     } catch (moveError) {
//       console.error('Error during move operation:', moveError);

//       // Cleanup any partial moves
//       try {
//         const [destExists] = await bucket.file(permanentPath).exists();
//         if (destExists) {
//           await bucket.file(permanentPath).delete();
//         }
//       } catch (cleanupError) {
//         console.error('Error during cleanup:', cleanupError);
//       }

//       throw moveError;
//     }

//   } catch (error: any) {
//     console.error('Move image error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Failed to move file',
//       message: error.message
//     });
//   }
// }

// export async function moveImage(req: Request, res: Response) {
//   try {
//     const { userId } = req.params;
//     const { fileName } = req.body;

//     // Add request logging
//     console.log('Move request received:', {
//       userId,
//       fileName,
//       body: req.body
//     });

//     if (!fileName) {
//       return res.status(400).json({
//         success: false,
//         error: 'Filename is required'
//       });
//     }

//     const bucket = storage.bucket();
//     const stagingPath = `staging/profileImages/${userId}/${fileName}`;
//     const permanentPath = `profileImages/${userId}/${fileName}`;

//     // Debug: List all files in staging directory
//     const [files] = await bucket.getFiles({
//       prefix: `staging/profileImages/${userId}/`
//     });

//     console.log('Files in staging directory:', {
//       stagingPath,
//       existingFiles: files.map(f => f.name)
//     });

//     // Check staging file exists
//     // const [stagingExists] = await bucket.file(stagingPath).exists();
//     // console.log('Staging file exists:', {
//     //   path: stagingPath,
//     //   exists: stagingExists
//     // });
//     const [stagingExists] = await bucket.file(stagingPath).exists();
//     if (!stagingExists) {
//       return res.status(404).json({
//         success: false,
//         error: 'Staged file not found'
//       });
//     }

//     if (!stagingExists) {
//       // Try alternative path without leading slash
//       const altStagingPath = stagingPath.startsWith('/') ? stagingPath.substring(1) : `/${stagingPath}`;
//       const [altExists] = await bucket.file(altStagingPath).exists();
      
//       console.log('Checking alternative path:', {
//         path: altStagingPath,
//         exists: altExists
//       });

//       if (!altExists) {
//         return res.status(404).json({
//           success: false,
//           error: 'Staged file not found',
//           details: {
//             triedPaths: [stagingPath, altStagingPath],
//             availableFiles: files.map(f => f.name)
//           }
//         });
//       }
//     }

//     try {
//       // Check and clean destination
//       const [destExists] = await bucket.file(permanentPath).exists();
//       if (destExists) {
//         console.log('Deleting existing file:', permanentPath);
//         await bucket.file(permanentPath).delete();
//       }

//       // Perform move operation
//       console.log('Moving file:', {
//         from: stagingPath,
//         to: permanentPath
//       });

//       await bucket.file(stagingPath).move(permanentPath);

//       // Verify move
//       const [movedExists] = await bucket.file(permanentPath).exists();
//       if (!movedExists) {
//         throw new Error('Move verification failed');
//       }

//       console.log('Move successful');

//       res.json({
//         success: true,
//         fileName,
//         filePath: permanentPath
//       });

//     } catch (moveError) {
//       console.error('Move operation failed:', moveError);

//       // Cleanup attempt
//       try {
//         const [destExists] = await bucket.file(permanentPath).exists();
//         if (destExists) {
//           await bucket.file(permanentPath).delete();
//         }
//       } catch (cleanupError) {
//         console.error('Cleanup error:', cleanupError);
//       }

//       throw moveError;
//     }

//   } catch (error: any) {
//     console.error('Request handling error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Failed to move file',
//       message: error.message
//     });
//   }
// }

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

// export async function proxyImage(req: Request, res: Response) {
//   try {
//     const { url } = req.query;
//     if (!url) {
//       return res.status(400).json({ error: 'URL is required' });
//     }

//     // Generate a signed URL with short expiration
//     const bucket = storage.bucket();
//     const filename = url.toString().split('/').pop();
//     const file = bucket.file(filename!);

//     const [signedUrl] = await file.getSignedUrl({
//       action: 'read',
//       expires: Date.now() + 1000 * 60 * 60, // 1 hour expiration
//     });

//     // Redirect to the signed URL
//     res.redirect(signedUrl);
//   } catch (error) {
//     console.error('Error proxying image:', error);
//     res.status(500).json({ error: 'Failed to proxy image' });
//   }
// }

// export const getStorageFile = async (req: Request, res: Response) => {
//   try {
//     // Extract token from query parameters
//     const token = req.query.token as string;
//     if (!token) {
//       return res.status(401).send('Unauthorized: No token provided');
//     }

//     // Verify the token
//     let decodedToken;
//     try {
//       decodedToken = jwt.verify(token, secret);
//     } catch (err) {
//       console.error('Token verification failed:', err);
//       return res.status(401).send('Unauthorized: Invalid token');
//     }

//     // Extract the file path from the request
//     const filePath = req.path.replace('/storage/', '');
//     console.log('Requested file path:', filePath);

//     // Fetch the file from Firebase Storage
//     const bucket = storage.bucket();
//     const file = bucket.file(filePath);

//     // Check if the file exists
//     const [exists] = await file.exists();
//     if (!exists) {
//       console.error('File does not exist in storage:', filePath);
//       return res.status(404).send('File not found');
//     }

//     // Stream the file to the response
//     const readStream = file.createReadStream();

//     // Set appropriate headers
//     res.setHeader('Content-Type', 'image/jpeg'); // Adjust MIME type if needed

//     // Handle errors during streaming
//     readStream.on('error', (err: any) => {
//       console.error('Error streaming file:', err);
//       res.status(500).send('Internal Server Error');
//     });

//     // Pipe the read stream to the response
//     readStream.pipe(res);

//   } catch (error) {
//     console.error('Error in /storage route:', error);
//     res.status(500).send('Internal Server Error');
//   }
// };
// export const getStorageFile = async (req: Request, res: Response) => {
//   try {
//     // 1. Token Validation
//     const token = req.query.token?.toString();
//     if (!token) {
//       return res.status(401).json({ 
//         success: false,
//         error: 'Authentication required' 
//       });
//     }

//     // Verify token
//     try {
//       await verifyTokenString(token);
//     } catch (error) {
//       console.error('Token verification failed:', error);
//       return res.status(401).json({ 
//         success: false,
//         error: 'Invalid token' 
//       });
//     }

//     // 2. File Path Extraction and Validation
//     const filePath = req.path.replace('/storage/', '');
//     if (!filePath) {
//       return res.status(400).json({
//         success: false,
//         error: 'Invalid file path'
//       });
//     }

//     console.log('Serving file:', filePath);

//     // 3. File Access and Validation
//     const bucket = storage.bucket();
//     const file = bucket.file(filePath);

//     const [exists] = await file.exists();
//     if (!exists) {
//       console.error('File not found:', filePath);
//       return res.status(404).json({
//         success: false,
//         error: 'File not found'
//       });
//     }

//     // 4. Get and Set Content Type
//     const [metadata] = await file.getMetadata();
//     res.setHeader('Content-Type', metadata.contentType || 'image/jpeg');
    
//     // 5. Set Caching Headers
//     res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hour cache
//     res.setHeader('Pragma', 'no-cache');
//     res.setHeader('Expires', '0');

//     // 6. Stream File with Error Handling
//     const readStream = file.createReadStream();

//     readStream.on('error', (error) => {
//       console.error('Streaming error:', error);
//       if (!res.headersSent) {
//         res.status(500).json({
//           success: false,
//           error: 'Error streaming file'
//         });
//       }
//     });

//     readStream.on('end', () => {
//       console.log('Successfully streamed:', filePath);
//     });

//     readStream.pipe(res);

//   } catch (error: any) {
//     console.error('Error serving file:', error);
//     if (!res.headersSent) {
//       res.status(500).json({
//         success: false,
//         error: 'Internal server error',
//         details: process.env.NODE_ENV === 'development' ? error.message : undefined
//       });
//     }
//   }
// };

// export const getStorageFile = async (req: Request, res: Response) => {
//   try {
//     console.log('Storage file request:', {
//       path: req.path,
//       query: req.query,
//       headers: req.headers
//     });

//     // 1. Token Validation
//     const token = req.query.token?.toString();
//     if (!token) {
//       return res.status(401).json({ 
//         success: false,
//         error: 'Authentication required' 
//       });
//     }

//     // Verify token
//     try {
//       await verifyTokenString(token);
//     } catch (error) {
//       console.error('Token verification failed:', error);
//       return res.status(401).json({ 
//         success: false,
//         error: 'Invalid token' 
//       });
//     }

//     // 2. File Path Extraction and Validation
//     let filePath = req.path.replace('/storage/', '');
//     // Remove any leading slashes
//     filePath = filePath.replace(/^\/+/, '');

//     if (!filePath) {
//       return res.status(400).json({
//         success: false,
//         error: 'Invalid file path'
//       });
//     }

//     console.log('Accessing file:', filePath);

//     // 3. File Access and Validation
//     const bucket = storage.bucket();
//     const file = bucket.file(filePath);

//     const [exists] = await file.exists();
//     if (!exists) {
//       console.error('File not found:', filePath);
//       return res.status(404).json({
//         success: false,
//         error: 'File not found'
//       });
//     }

//     // 4. Get and Set Content Type
//     const [metadata] = await file.getMetadata();
//     res.setHeader('Content-Type', metadata.contentType || 'image/jpeg');
    
//     // 5. Set Caching Headers
//     res.setHeader('Cache-Control', 'public, max-age=3600');
//     res.setHeader('Pragma', 'no-cache');
//     res.setHeader('Expires', '0');

//     // 6. Stream File
//     const readStream = file.createReadStream();

//     readStream.on('error', (error) => {
//       console.error('Streaming error:', error);
//       if (!res.headersSent) {
//         res.status(500).json({
//           success: false,
//           error: 'Error streaming file'
//         });
//       }
//     });

//     readStream.on('end', () => {
//       console.log('Successfully streamed:', filePath);
//     });

//     readStream.pipe(res);

//   } catch (error: any) {
//     console.error('Error serving file:', error);
//     if (!res.headersSent) {
//       res.status(500).json({
//         success: false,
//         error: 'Internal server error',
//         details: process.env.NODE_ENV === 'development' ? error.message : undefined
//       });
//     }
//   }
// };

export const getStorageFile = async (req: Request, res: Response) => {
  try {
    console.log('Storage file request:', {
      path: req.path,
      query: req.query,
      headers: req.headers
    });

    // 1. Token Validation
    const token = req.query.token?.toString();
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required' 
      });
    }

    // Verify token
    try {
      await verifyTokenString(token);
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ 
        success: false,
        error: 'Invalid token' 
      });
    }

    // 2. File Path Extraction and Validation
    // First, remove '/storage/' and any leading slashes
    let filePath = req.path.replace(/^\/storage\//, '').replace(/^\/+/, '');

    // If the path doesn't include profileImages and it's not a staging path, 
    // assume it's a profile image
    if (!filePath.includes('profileImages') && !filePath.startsWith('staging/')) {
      filePath = `profileImages/${filePath}`;
    }

    if (!filePath) {
      return res.status(400).json({
        success: false,
        error: 'Invalid file path'
      });
    }

    console.log('Processing file path:', {
      originalPath: req.path,
      processedPath: filePath
    });

    // 3. File Access and Validation
    const bucket = storage.bucket();
    let file = bucket.file(filePath);

    const [exists] = await file.exists();
    if (!exists) {
      console.error('File not found:', filePath);
      // Try alternate path if original doesn't exist
      const altPath = filePath.startsWith('staging/') 
        ? `profileImages/${filePath.replace('staging/', '')}`
        : `staging/${filePath}`;
        
      console.log('Trying alternate path:', altPath);
      const altFile = bucket.file(altPath);
      const [altExists] = await altFile.exists();
      
      if (!altExists) {
        return res.status(404).json({
          success: false,
          error: 'File not found',
          details: {
            attemptedPaths: [filePath, altPath]
          }
        });
      }
      // Use alternate file if it exists
      file = altFile;
    }

    // 4. Get and Set Content Type
    const [metadata] = await file.getMetadata();
    res.setHeader('Content-Type', metadata.contentType || 'image/jpeg');
    
    // 5. Set Caching Headers
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // 6. Stream File with Error Handling
    const readStream = file.createReadStream();

    readStream.on('error', (error) => {
      console.error('Streaming error:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: 'Error streaming file'
        });
      }
    });

    readStream.on('end', () => {
      console.log('Successfully streamed:', filePath);
    });

    readStream.pipe(res);

  } catch (error: any) {
    console.error('Error serving file:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};