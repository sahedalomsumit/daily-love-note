require('dotenv').config();
const admin = require('firebase-admin');

try {
  let serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (serviceAccountStr && serviceAccountStr.startsWith("'") && serviceAccountStr.endsWith("'")) {
    serviceAccountStr = serviceAccountStr.slice(1, -1);
  }
  const serviceAccount = JSON.parse(serviceAccountStr);
  
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
  
  const db = admin.firestore();
  
  async function check() {
    try {
      console.log('Project ID:', serviceAccount.project_id);
      console.log('Attempting to list collections...');
      const collections = await db.listCollections();
      console.log('Collections:', collections.map(c => c.id));
      
      console.log('Attempting to read "messages" collection...');
      const snapshot = await db.collection('messages').limit(1).get();
      console.log('Successfully read messages. Count:', snapshot.size);
    } catch (e) {
      console.error('Connection check failed:');
      console.error('Code:', e.code);
      console.error('Details:', e.details);
      console.error('Message:', e.message);
    }
  }
  
  check();
} catch (e) {
  console.error('Setup failed:', e.message);
}
