// lib/firebase-adapter.ts
import { Adapter } from 'next-auth/adapters';
import { firestore } from './firebase-admin'; // Correct path

// Define the types for User and Session
export interface FirebaseUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
  createdAt: FirebaseFirestore.Timestamp;
}

export interface FirebaseSession {
  userId: string;
  email: string;
  createdAt: FirebaseFirestore.Timestamp;
}

// Custom Firebase Adapter Implementation
export function FirebaseAdapter(): Adapter {
  return {
    async createUser(profile) {
      const userRef = firestore.collection('users').doc(profile.email);

      await userRef.set({
        email: profile.email,
        name: profile.name,
        image: profile.image,
        createdAt: new Date(),
      });

      return {
        id: profile.email,
        email: profile.email,
        name: profile.name,
        image: profile.image,
        createdAt: new Date(),
      };
    },

    async getUser(id: string) {
      const userDoc = await firestore.collection('users').doc(id).get();
      if (!userDoc.exists) return null;

      const data = userDoc.data();
      return { id: data?.email, ...data } as FirebaseUser;
    },

    async getUserByEmail(email: string) {
      const userDoc = await firestore.collection('users').doc(email).get();
      if (!userDoc.exists) return null;

      const data = userDoc.data();
      return { id: data?.email, ...data } as FirebaseUser;
    },

    async updateUser(user: FirebaseUser) {
      const userRef = firestore.collection('users').doc(user.id);
      await userRef.update(user);
      return user;
    },

    async linkAccount(account) {
      // Implement account linking logic here if needed
      return account;
    },

    async createSession(user: FirebaseUser) {
      const sessionRef = firestore.collection('sessions').doc(user.email);
      await sessionRef.set({
        userId: user.id,
        email: user.email,
        createdAt: new Date(),
      });
      return { userId: user.id, email: user.email } as FirebaseSession;
    },

    async getSession(sessionToken: string) {
      const sessionDoc = await firestore.collection('sessions').doc(sessionToken).get();
      if (!sessionDoc.exists) return null;

      const data = sessionDoc.data();
      return { userId: data?.userId, email: data?.email } as FirebaseSession;
    },

    async deleteUser(userId: string) {
      await firestore.collection('users').doc(userId).delete();
    },

    async deleteSession(sessionToken: string) {
      await firestore.collection('sessions').doc(sessionToken).delete();
    },
  };
}
