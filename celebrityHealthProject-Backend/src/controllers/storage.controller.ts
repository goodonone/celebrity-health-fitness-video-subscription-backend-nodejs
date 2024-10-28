// src/controllers/storage.controller.ts
import { Request, Response } from 'express';
import { storage } from '../config/firebase.config';
import { getDownloadURL } from 'firebase-admin/storage';

// export async function getImage(req: Request, res: Response) {
//   try {
//     const { userId, fileName } = req.params;
//     const filePath = `profileImages/${userId}/${fileName}`;
    
//     // Get file metadata and download URL from Firebase
//     const fileRef = storage.bucket().file(filePath);
//     const [exists] = await fileRef.exists();
    
//     if (!exists) {
//       return res.status(404).send('Image not found');
//     }

//     // Get file stream
//     const stream = fileRef.createReadStream();

//     // Get signed URL from Firebase
//     const [signedUrl] = await fileRef.getSignedUrl({
//       action: 'read',
//       expires: Date.now() + 60 * 60 * 1000, // URL expires in 1 hour
//     });

//     // Redirect to the signed URL
//     res.redirect(signedUrl);

//   } catch (error) {
//     console.error('Error serving image:', error);
//     res.status(500).send('Error serving image');
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
//     const filePath = `profileImages/${userId}/${fileName}`;

//     console.log('Attempting to serve:', filePath);
    
//     const fileRef = storage.bucket().file(filePath);
//     const [exists] = await fileRef.exists();
    
//     if (!exists) {
//       console.log('File not found:', filePath);
//       return res.status(404).send('Image not found');
//     }

//     // Get file stream
//     const stream = fileRef.createReadStream();

//     // Set appropriate headers
//     res.setHeader('Content-Type', 'image/jpeg'); // Adjust content type as needed
//     res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour

//     // Pipe the file stream to response
//     stream.pipe(res);

//     stream.on('error', (error) => {
//       console.error('Stream error:', error);
//       res.status(500).send('Error streaming image');
//     });

//   } catch (error) {
//     console.error('Error serving image:', error);
//     res.status(500).send('Error serving image');
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
    const filePath = `profileImages/${userId}/${fileName}`;
    
    console.log('Attempting to serve:', filePath);
    
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
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour

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


export function generateProxyUrl(req: Request, filePath: string): string {
  const baseUrl = process.env.API_BASE_URL || `${req.protocol}://${req.get('host')}`;
  return `${baseUrl}/api/storage/${encodeURIComponent(filePath)}`;
}