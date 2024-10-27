// // src/scripts/verify-firebase.ts
// import dotenv from 'dotenv';
// import { initializeApp, cert } from 'firebase-admin/app';
// import { getAuth } from 'firebase-admin/auth';
// import { getStorage } from 'firebase-admin/storage';

// // Load environment variables
// dotenv.config();

// async function verifyFirebaseConfig() {
//   console.log('Starting Firebase verification...');
//   console.log('Environment check:');
//   console.log('- Project ID:', process.env.FIREBASE_PROJECT_ID);
//   console.log('- Client Email:', process.env.FIREBASE_CLIENT_EMAIL);
//   console.log('- Storage Bucket:', process.env.FIREBASE_STORAGE_BUCKET);
//   console.log('- Private Key exists:', !!process.env.FIREBASE_PRIVATE_KEY);

//   try {
//     // Initialize Firebase Admin
//     const app = initializeApp({
//       credential: cert({
//         projectId: process.env.FIREBASE_PROJECT_ID,
//         privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
//         clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//       }),
//       storageBucket: process.env.FIREBASE_STORAGE_BUCKET
//     });

//     console.log('✓ Firebase Admin initialized');

//     // Initialize services
//     const auth = getAuth(app);
//     const storage = getStorage(app);

//     // Test Auth
//     console.log('\nTesting Auth...');
//     try {
//       await auth.getUser('test-user-id').catch(error => {
//         if (error.code === 'auth/user-not-found') {
//           console.log('✓ Auth is working correctly (expected user-not-found error)');
//           return;
//         }
//         throw error;
//       });
//     } catch (error: any) {
//       console.error('Auth test failed:', error.message);
//       if (error.code) console.error('Error code:', error.code);
//       throw error;
//     }

//     // Test Storage
//     console.log('\nTesting Storage...');
//     try {
//       const bucket = storage.bucket();
//       await bucket.exists();
//       console.log('✓ Storage is working correctly');
//     } catch (error: any) {
//       console.error('Storage test failed:', error.message);
//       if (error.code) console.error('Error code:', error.code);
//       throw error;
//     }

//     console.log('\nAll Firebase services verified successfully!');
//   } catch (error) {
//     console.error('\nFirebase verification failed:', error);
//     process.exit(1);
//   }
// }

// verifyFirebaseConfig();

// import dotenv from 'dotenv';
// import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
// import { getAuth } from 'firebase-admin/auth';
// import { getStorage } from 'firebase-admin/storage';

// // Load environment variables
// dotenv.config();

// async function verifyFirebaseConfig() {
//   console.log('\nStarting Firebase verification with detailed logging...');
  
//   // Detailed environment variable check
//   const serviceAccount = {
//     type: 'service_account',
//     project_id: process.env.FIREBASE_PROJECT_ID,
//     private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
//     private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
//     client_email: process.env.FIREBASE_CLIENT_EMAIL,
//     client_id: process.env.FIREBASE_CLIENT_ID,
//     auth_uri: "https://accounts.google.com/o/oauth2/auth",
//     token_uri: "https://oauth2.googleapis.com/token",
//     auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
//     client_x509_cert_url: process.env.FIREBASE_CERT_URL
//   };

//   console.log('\nService Account Details:');
//   console.log('- Type:', serviceAccount.type);
//   console.log('- Project ID:', serviceAccount.project_id);
//   console.log('- Private Key ID:', serviceAccount.private_key_id?.substring(0, 5) + '...');
//   console.log('- Private Key exists:', !!serviceAccount.private_key);
//   console.log('- Client Email:', serviceAccount.client_email);
//   console.log('- Storage Bucket:', process.env.FIREBASE_STORAGE_BUCKET);

//   try {
//     console.log('\nInitializing Firebase Admin...');
    
//     // Initialize Firebase Admin with full service account
//     const app = initializeApp({
//       credential: cert(serviceAccount as ServiceAccount),
//       storageBucket: process.env.FIREBASE_STORAGE_BUCKET
//     });

//     console.log('✓ Firebase Admin initialized');

//     // Initialize services
//     const auth = getAuth(app);
//     const storage = getStorage(app);

//     // Test Auth
//     console.log('\nTesting Auth...');
//     try {
//       // First, try to list users instead of getting a specific user
//       const listUsersResult = await auth.listUsers(1);
//       console.log('✓ Auth listUsers successful, found', listUsersResult.users.length, 'users');
//     } catch (error: any) {
//       console.error('Auth test failed:', error.message);
//       console.error('Error code:', error.code);
//       console.error('Full error:', error);
//       throw error;
//     }

//     // Test Storage
//     console.log('\nTesting Storage...');
//     try {
//       const bucket = storage.bucket();
//       const [exists] = await bucket.exists();
//       console.log('✓ Storage bucket exists:', exists);
//     } catch (error: any) {
//       console.error('Storage test failed:', error.message);
//       console.error('Error code:', error.code);
//       throw error;
//     }

//     console.log('\nAll Firebase services verified successfully!');
//   } catch (error) {
//     console.error('\nFirebase verification failed:', error);
//     if (error instanceof Error) {
//       console.error('Error name:', error.name);
//       console.error('Error message:', error.message);
//       console.error('Error stack:', error.stack);
//     }
//     process.exit(1);
//   }
// }

// verifyFirebaseConfig();

import dotenv from 'dotenv';
import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';

dotenv.config();

async function verifyFirebaseConfig() {
  console.log('\nStarting Firebase verification...');

  // Create a complete service account object
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

  try {
    // Initialize Firebase Admin
    const app = initializeApp({
      credential: cert(serviceAccount as ServiceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });

    console.log('✓ Firebase Admin initialized');

    // Get Auth instance
    const auth = getAuth(app);
    
    // Test creating a custom token (this should work without any users in the system)
    console.log('\nTesting Auth by creating a custom token...');
    try {
      const customToken = await auth.createCustomToken('test-user');
      console.log('✓ Successfully created custom token');
      console.log('Custom token:', customToken.substring(0, 20) + '...');
    } catch (error: any) {
      console.error('Failed to create custom token:', error);
      throw error;
    }

    // Test Storage
    console.log('\nTesting Storage...');
    const storage = getStorage(app);
    try {
      const bucket = storage.bucket();
      const [exists] = await bucket.exists();
      console.log('✓ Successfully connected to storage bucket');
      console.log('Bucket exists:', exists);
    } catch (error: any) {
      console.error('Storage test failed:', error);
      throw error;
    }

    console.log('\nAll Firebase services verified successfully!');
  } catch (error) {
    console.error('\nFirebase verification failed:', error);
    process.exit(1);
  }
}

verifyFirebaseConfig();