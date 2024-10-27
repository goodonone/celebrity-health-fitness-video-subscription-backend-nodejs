// import { initializeApp, cert } from 'firebase-admin/app';
// import { getAuth } from 'firebase-admin/auth';
// import { getStorage } from 'firebase-admin/storage';
// import dotenv from 'dotenv';

// dotenv.config();

// // Load and check required environment variables
// const requiredVars = [
//   'FIREBASE_PROJECT_ID',
//   'FIREBASE_PRIVATE_KEY',
//   'FIREBASE_CLIENT_EMAIL',
//   'FIREBASE_STORAGE_BUCKET'
// ];

// requiredVars.forEach(varName => {
//   if (!process.env[varName]) {
//     throw new Error(`Missing required environment variable: ${varName}`);
//   }
// });

// // Initialize Firebase Admin
// const app = initializeApp({
//   credential: cert({
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
//     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//   }),
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET
// });

// // Initialize services
// const auth = getAuth(app);
// const storage = getStorage(app);

// // Verify initialization
// const verifyAuth = async (): Promise<void> => {
//   try {
//     // List users as a simple verification that auth is working
//     await auth.listUsers(1);
//     console.log('Firebase Admin Auth initialized successfully');
//   } catch (error: unknown) {
//     console.error('Firebase Admin Auth initialization failed:', error);
//     throw error;
//   }
// };

// // Run verification
// verifyAuth().catch((error: unknown) => {
//   console.error('Firebase verification failed:', error);
//   process.exit(1);
// });

// export { auth, storage };
// export default app;

// import { initializeApp, cert } from 'firebase-admin/app';
// import { getAuth } from 'firebase-admin/auth';
// import { getStorage } from 'firebase-admin/storage';
// import dotenv from 'dotenv';

// dotenv.config();

// // Debug: Log environment variables (remove in production)
// console.log('Checking Firebase configuration...');
// console.log('Project ID:', process.env.FIREBASE_PROJECT_ID);
// console.log('Client Email:', process.env.FIREBASE_CLIENT_EMAIL);
// console.log('Storage Bucket:', process.env.FIREBASE_STORAGE_BUCKET);
// console.log('Private Key length:', process.env.FIREBASE_PRIVATE_KEY?.length);

// // Validate environment variables
// const requiredEnvVars = {
//   FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
//   FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
//   FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
//   FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET
// };

// // Check for missing variables
// Object.entries(requiredEnvVars).forEach(([key, value]) => {
//   if (!value) {
//     throw new Error(`Missing required environment variable: ${key}`);
//   }
// });

// try {
//   // Create service account object
//   const serviceAccount = {
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
//     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//   };

//   // Initialize Firebase Admin
//   const app = initializeApp({
//     credential: cert(serviceAccount),
//     storageBucket: process.env.FIREBASE_STORAGE_BUCKET
//   });

//   console.log('Firebase Admin initialization successful');

//   // Initialize services
//   const auth = getAuth(app);
//   const storage = getStorage(app);

//   // Simple auth verification function
//   const verifyAuth = async (): Promise<void> => {
//     try {
//       // Try to get a non-existent user (this will fail with a user-not-found error if auth is working)
//       await auth.getUser('test-user-id').catch(error => {
//         if (error.code === 'auth/user-not-found') {
//           console.log('Firebase Auth is properly configured and working');
//           return;
//         }
//         throw error;
//       });
//     } catch (error) {
//       console.error('Detailed Auth Error:', error);
//       throw error;
//     }
//   };

//   // Run verification but don't block initialization
//   verifyAuth().catch(error => {
//     console.error('Auth verification warning:', error);
//   });

//   export { auth, storage };
//   export default app;

// } catch (error) {
//   console.error('Firebase initialization error:', error);
//   // Log detailed error information
//   if (error instanceof Error) {
//     console.error('Error name:', error.name);
//     console.error('Error message:', error.message);
//     console.error('Error stack:', error.stack);
//   }
//   throw error;
// }

// import { initializeApp, cert } from 'firebase-admin/app';
// import { getAuth } from 'firebase-admin/auth';
// import { getStorage } from 'firebase-admin/storage';
// import dotenv from 'dotenv';

// dotenv.config();

// // Debug: Log environment variables (remove in production)
// console.log('Checking Firebase configuration...');
// console.log('Project ID:', process.env.FIREBASE_PROJECT_ID);
// console.log('Client Email:', process.env.FIREBASE_CLIENT_EMAIL);
// console.log('Storage Bucket:', process.env.FIREBASE_STORAGE_BUCKET);
// console.log('Private Key length:', process.env.FIREBASE_PRIVATE_KEY?.length);

// // Validate environment variables
// const requiredEnvVars = {
//   FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
//   FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
//   FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
//   FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET
// };

// // Check for missing variables
// Object.entries(requiredEnvVars).forEach(([key, value]) => {
//   if (!value) {
//     throw new Error(`Missing required environment variable: ${key}`);
//   }
// });

// // Create service account object
// const serviceAccount = {
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
//   clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
// };

// // Initialize Firebase Admin
// const app = initializeApp({
//   credential: cert(serviceAccount),
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET
// });

// console.log('Firebase Admin initialization successful');

// // Initialize services
// const auth = getAuth(app);
// const storage = getStorage(app);

// // Simple auth verification function
// const verifyAuth = async (): Promise<void> => {
//   try {
//     // Try to get a non-existent user (this will fail with a user-not-found error if auth is working)
//     await auth.getUser('test-user-id').catch(error => {
//       if (error.code === 'auth/user-not-found') {
//         console.log('Firebase Auth is properly configured and working');
//         return;
//       }
//       throw error;
//     });
//   } catch (error) {
//     console.error('Detailed Auth Error:', error);
//     throw error;
//   }
// };

// // Run verification but don't block initialization
// verifyAuth().catch(error => {
//   console.error('Auth verification warning:', error);
// });

// // Handle unexpected errors
// process.on('unhandledRejection', (error) => {
//   console.error('Unhandled Firebase initialization error:', error);
// });

// export { auth, storage };
// export default app;

import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';
import dotenv from 'dotenv';

dotenv.config();

// Create the service account object with all required fields
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CERT_URL
};

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

// Initialize services
const auth = getAuth(app);
const storage = getStorage(app);

// Simple verification on startup
const verifyServices = async () => {
  try {
    // Verify Auth
    await auth.createCustomToken('test-user');
    console.log('✓ Firebase Auth initialized successfully');
    
    // Verify Storage
    const bucket = storage.bucket();
    await bucket.exists();
    console.log('✓ Firebase Storage initialized successfully');
  } catch (error) {
    console.error('Firebase service verification failed:', error);
    // Don't throw the error, just log it
  }
};

// Run verification but don't block initialization
verifyServices();

export { auth, storage };
export default app;