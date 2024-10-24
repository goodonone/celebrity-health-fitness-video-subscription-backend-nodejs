import { storage } from '../config/firebase.config';

export async function deleteImageFromFirebase(imageUrl: string): Promise<void> {
  try {
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

export async function generateUploadUrl(fileName: string, contentType: string): Promise<string> {
  const bucket = storage.bucket();
  const file = bucket.file(`profileImages/${fileName}`);
  
  const [signedUrl] = await file.getSignedUrl({
    version: 'v4',
    action: 'write',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType,
  });
  
  return signedUrl;
}