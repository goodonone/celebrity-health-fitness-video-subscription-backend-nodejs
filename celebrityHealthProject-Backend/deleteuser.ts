import { auth } from './src/config/firebase.config';

async function deleteUser(uid: string) {
  try {
    await auth.deleteUser(uid);
    console.log(`Successfully deleted user with UID: ${uid}`);
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}

deleteUser('12636425178579968');