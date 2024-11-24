// import { NextApiRequest, NextApiResponse } from 'next';
// import { getFirestore } from 'firebase-admin/firestore';
// import { getAuth } from 'firebase-admin/auth';

// const firestore = getFirestore();

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method Not Allowed' });
//   }

//   try {
//     const authToken = req.headers.authorization?.split(' ')[1];
//     if (!authToken) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     const decodedToken = await getAuth().verifyIdToken(authToken);
//     const userId = decodedToken.uid;

//     const userRef = firestore.collection('users').doc(userId);
//     const userDoc = await userRef.get();

//     if (!userDoc.exists) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     const { availableCoins, usedCoins } = userDoc.data() || {};

//     if (availableCoins <= 0) {
//       return res.status(400).json({ error: 'No coins available' });
//     }

//     await userRef.update({
//       availableCoins: availableCoins - 1,
//       usedCoins: (usedCoins || 0) + 1,
//     });

//     res.status(200).json({ availableCoins: availableCoins - 1, usedCoins: (usedCoins || 0) + 1 });
//   } catch (error) {
//     console.error('Error using coin:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }
