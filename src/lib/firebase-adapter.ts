import { Adapter, AdapterUser } from 'next-auth/adapters';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firestore
const firestore = getFirestore();

// Define the types for User and Session
export interface FirebaseUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
  createdAt: Date;
}

export interface FirebaseSession {
  userId: string;
  email: string;
  createdAt: Date;
}

// Custom Firebase Adapter Implementation
export function FirebaseAdapter(): Adapter {
  return {
    async createUser(profile: { email: string; name?: unknown; image?: unknown }): Promise<AdapterUser> {
      const userRef = firestore.collection('users').doc(profile.email);

      const user: FirebaseUser = {
        id: profile.email,
        email: profile.email,
        name: typeof profile.name === 'string' ? profile.name : '',
        image: typeof profile.image === 'string' ? profile.image : '',
        createdAt: new Date(),
      };

      await userRef.set(user);

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        emailVerified: null, // Set this as null for now
      };
    },

    async getUser(id: string): Promise<AdapterUser | null> {
      const userDoc = await firestore.collection('users').doc(id).get();
      if (!userDoc.exists) return null;

      const data = userDoc.data() as FirebaseUser;
      return {
        id: id,
        email: data.email,
        name: data.name,
        image: data.image,
        emailVerified: null, // This field is required for AdapterUser
      };
    },

    async getUserByEmail(email: string): Promise<AdapterUser | null> {
      const userDoc = await firestore.collection('users').doc(email).get();
      if (!userDoc.exists) return null;

      const data = userDoc.data() as FirebaseUser;
      return {
        id: email,
        email: data.email,
        name: data.name,
        image: data.image,
        emailVerified: null, // Required field
      };
    },

    async updateUser(user: AdapterUser): Promise<AdapterUser> {
      const userRef = firestore.collection('users').doc(user.id);
      await userRef.update({
        name: user.name,
        image: user.image,
        emailVerified: user.emailVerified,
      });
      return user;
    },

    async linkAccount(account: any) {
      throw new Error('linkAccount method is not implemented.');
    },

    async createSession(user: AdapterUser): Promise<FirebaseSession> {
      const sessionRef = firestore.collection('sessions').doc(user.id);

      const session: FirebaseSession = {
        userId: user.id,
        email: user.email!,
        createdAt: new Date(),
      };

      await sessionRef.set(session);

      return session;
    },

    async getSession(sessionToken: string): Promise<FirebaseSession | null> {
      const sessionDoc = await firestore.collection('sessions').doc(sessionToken).get();
      if (!sessionDoc.exists) return null;

      const data = sessionDoc.data() as FirebaseSession;
      return data;
    },

    async deleteUser(userId: string): Promise<void> {
      await firestore.collection('users').doc(userId).delete();
    },

    async deleteSession(sessionToken: string): Promise<void> {
      await firestore.collection('sessions').doc(sessionToken).delete();
    },
  };
}
