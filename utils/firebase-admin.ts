import admin from 'firebase-admin';

if (!admin.apps.length) {
  // Put entire service key on one line
  const service = JSON.parse('' + process.env.FIREBASE_ADMIN);

  admin.initializeApp({
    credential: admin.credential.cert(service),
  });
}

export const db = admin.firestore();
