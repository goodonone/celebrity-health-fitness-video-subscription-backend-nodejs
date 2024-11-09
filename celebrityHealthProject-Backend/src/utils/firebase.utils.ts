// import { storage } from '../config/firebase.config';

// export async function deleteImageFromFirebase(imageUrl: string): Promise<void> {
//   try {
//     // Extract file path from URL
//     const filePathMatch = imageUrl.match(/o\/(.*?)\?/);
//     if (!filePathMatch) {
//       throw new Error('Invalid Firebase Storage URL format');
//     }
    
//     const filePath = decodeURIComponent(filePathMatch[1]);
//     const bucket = storage.bucket();
//     const file = bucket.file(filePath);
    
//     // Check if file exists
//     const [exists] = await file.exists();
//     if (!exists) {
//       console.log('File does not exist:', filePath);
//       return;
//     }
    
//     // Delete the file
//     await file.delete();
//     console.log('Successfully deleted file:', filePath);
//   } catch (error) {
//     console.error('Error deleting file from Firebase:', error);
//     throw error;
//   }
// }

// export async function generateUploadUrl(userId: string, fileName: string, contentType: string): Promise<string> {
//   const bucket = storage.bucket();
//   const filePath = `profileImages/${userId}/${fileName}`;
//   const file = bucket.file(filePath);
  
//   const [signedUrl] = await file.getSignedUrl({
//     version: 'v4',
//     action: 'write',
//     expires: Date.now() + 15 * 60 * 1000, // 15 minutes
//     contentType,
//   });
  
//   return signedUrl;
// }


import { storage } from '../config/firebase.config';

export async function deleteImageFromFirebase(imageUrl: string): Promise<void> {
  try {
    if (!imageUrl || !imageUrl.includes('firebasestorage.googleapis.com')) {
      console.log('Invalid or non-Firebase URL provided');
      return;
    }

    // Extract file path from URL
    const filePathMatch = imageUrl.match(/o\/(.*?)\?/);
    if (!filePathMatch) {
      throw new Error('Invalid Firebase Storage URL format');
    }
    
    const filePath = decodeURIComponent(filePathMatch[1]);
    const bucket = storage.bucket();
    const file = bucket.file(filePath);
    
    // Check if file exists
    const [exists] = await file.exists();
    if (!exists) {
      console.log('File does not exist:', filePath);
      return;
    }
    
    // Delete the file
    await file.delete();
    console.log('Successfully deleted file:', filePath);
  } catch (error) {
    console.error('Error deleting file from Firebase:', error);
    throw error;
  }
}

export async function generateUploadUrl(userId: string, fileName: string, contentType: string): Promise<string> {
  try {
    if (!userId || !fileName || !contentType) {
      throw new Error('Missing required parameters');
    }

    const bucket = storage.bucket();
    const filePath = `profileImages/${userId}/${fileName}`;
    const file = bucket.file(filePath);
    
    const [signedUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType,
    });
    
    if (!signedUrl) {
      throw new Error('Failed to generate signed URL');
    }

    return signedUrl;
  } catch (error) {
    console.error('Error generating upload URL:', error);
    throw error;
  }
}