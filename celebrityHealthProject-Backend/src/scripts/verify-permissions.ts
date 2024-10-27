import dotenv from 'dotenv';
import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';

dotenv.config();

async function verifyPermissions() {
  console.log('\nVerifying Firebase Permissions...');

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
    console.log('\nInitializing with service account:', serviceAccount.client_email);
    
    const app = initializeApp({
      credential: cert(serviceAccount as ServiceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });

    const auth = getAuth(app);
    const storage = getStorage(app);

    // Test Auth Permissions
    console.log('\nTesting Auth permissions...');
    try {
      const customToken = await auth.createCustomToken('test-user');
      console.log('✓ Successfully created custom token');
    } catch (error: any) {
      console.error('Auth permission test failed:', error.message);
      if (error.code) console.error('Error code:', error.code);
      throw error;
    }

    // Test Storage Permissions
    console.log('\nTesting Storage permissions...');
    try {
      const bucket = storage.bucket();
      const [exists] = await bucket.exists();
      console.log('✓ Successfully accessed storage bucket');
    } catch (error: any) {
      console.error('Storage permission test failed:', error.message);
      if (error.code) console.error('Error code:', error.code);
      throw error;
    }

    console.log('\nAll permission tests passed successfully!');
  } catch (error) {
    console.error('\nPermission verification failed:', error);
    process.exit(1);
  }
}

verifyPermissions();