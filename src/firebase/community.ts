import { db } from './firebaseConfig';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  onSnapshot,
  updateDoc,
  orderBy,
  limit 
} from 'firebase/firestore';
import { Rating, CommunityStats } from '../types/community';

export const submitRating = async (rating: Rating) => {
  // Create a new rating document with an auto-generated ID
  const ratingRef = doc(collection(db, 'ratings'));
  
  // Clean up the rating object to remove undefined values
  const cleanRating = {
    userId: rating.userId,
    userName: rating.userName,
    timestamp: Date.now(),
    inclusionRating: rating.inclusionRating,
    productivityRating: rating.productivityRating,
    comment: rating.comment || '' // Set empty string if comment is undefined
  };

  await setDoc(ratingRef, cleanRating);

  // Update user's profile
  const userRef = doc(db, 'users', rating.userId);
  await updateDoc(userRef, {
    lastActive: Date.now()
  });

  // Update community stats
  await updateCommunityStats();
};

export const updateCommunityStats = async () => {
  const ratingsSnapshot = await getDocs(collection(db, 'ratings'));
  let totalInclusion = 0;
  let totalProductivity = 0;
  let count = 0;

  ratingsSnapshot.forEach((doc) => {
    const rating = doc.data() as Rating;
    totalInclusion += rating.inclusionRating;
    totalProductivity += rating.productivityRating;
    count++;
  });

  const stats: CommunityStats = {
    averageInclusion: count > 0 ? totalInclusion / count : 0,
    averageProductivity: count > 0 ? totalProductivity / count : 0,
    totalRatings: count,
    lastUpdated: Date.now()
  };

  await setDoc(doc(db, 'communityStats', 'current'), stats);
};

export const subscribeToRatings = (callback: (ratings: Rating[]) => void) => {
  const q = query(
    collection(db, 'ratings'),
    orderBy('timestamp', 'desc'),
    limit(50)
  );

  return onSnapshot(q, (snapshot) => {
    const ratings = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        comment: data.comment || '' // Ensure comment is never undefined
      } as Rating;
    });
    callback(ratings);
  });
};

export const subscribeToCommunityStats = (callback: (stats: CommunityStats) => void) => {
  return onSnapshot(doc(db, 'communityStats', 'current'), (snapshot) => {
    callback(snapshot.data() as CommunityStats);
  });
};