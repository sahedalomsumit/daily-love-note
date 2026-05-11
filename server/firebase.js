const admin = require('firebase-admin');

try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error: Make sure FIREBASE_SERVICE_ACCOUNT in .env is a valid minified JSON.');
  console.error(error.message);
  process.exit(1); // Exit if critical service fails
}

const db = admin.firestore();

const saveMessage = async (messageData) => {
  return await db.collection('messages').add({
    ...messageData,
    sentAt: admin.firestore.FieldValue.serverTimestamp()
  });
};

const getRecentMessages = async (limit = 30) => {
  try {
    const snapshot = await db.collection('messages')
      .orderBy('sentAt', 'desc')
      .limit(limit)
      .get();
    
    return snapshot.docs.map(doc => doc.data().content);
  } catch (error) {
    console.error('Firestore getRecentMessages error:', error.message);
    return [];
  }
};

const getAllMessages = async () => {
  try {
    const snapshot = await db.collection('messages')
      .orderBy('sentAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Firestore getAllMessages error:', error.message);
    throw error; // Re-throw to show error in UI
  }
};

module.exports = { saveMessage, getRecentMessages, getAllMessages };
