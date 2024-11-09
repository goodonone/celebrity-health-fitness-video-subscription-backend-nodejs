// utils/firebase-verify.ts
// import { Auth } from 'firebase-admin/auth';
// import { Storage } from 'firebase-admin/storage';

// export async function verifyFirebaseServices(auth: Auth, storage: Storage): Promise<void> {
//   try {
//     // Verify Auth
//     await auth.listUsers(1);
//     console.log('✓ Firebase Auth service verified');

//     // Verify Storage
//     const bucket = storage.bucket();
//     await bucket.exists();
//     console.log('✓ Firebase Storage service verified');

//     console.log('All Firebase services initialized successfully');
//   } catch (error: unknown) {
//     console.error('Firebase service verification failed:', error);
//     if (error instanceof Error) {
//       throw new Error(`Firebase verification failed: ${error.message}`);
//     }
//     throw error;
//   }
// }

// src/scripts/verify-firebase.ts
import { auth, storage } from '../config/firebase.config';

async function verifyFirebaseConfig() {
  console.log('Starting Firebase verification...');

  try {
    // Test Auth
    console.log('Testing Auth...');
    await auth.getUser('test-user-id').catch(error => {
      if (error.code === 'auth/user-not-found') {
        console.log('✓ Auth is working correctly (expected user-not-found error)');
        return;
      }
      throw error;
    });

    // Test Storage
    console.log('Testing Storage...');
    const bucket = storage.bucket();
    await bucket.exists();
    console.log('✓ Storage is working correctly');

    console.log('All Firebase services verified successfully!');
  } catch (error) {
    console.error('Firebase verification failed:', error);
    process.exit(1);
  }
}

verifyFirebaseConfig();