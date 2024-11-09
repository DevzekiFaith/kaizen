import { NextResponse } from 'next/server';
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { prisma } from '@/lib/prisma';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID || process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    if (data.type === 'contact') {
      try {
        await addDoc(collection(db, "contactMessages"), {
          ...data,
          timestamp: serverTimestamp(),
          status: "unread"
        });
        
        return NextResponse.json({
          success: true,
          message: "Message sent successfully"
        });
      } catch (firestoreError: unknown) {
        console.error('Firestore error:', firestoreError);
        const errorMessage = (firestoreError as Error).message || 'Failed to save to database';
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
      }
    }

    if (data.type === 'coins') {
      const user = await prisma.user.update({
        where: { email: data.email },
        data: {
          usedCoins: { increment: 1 }
        }
      });
      return NextResponse.json(user);
    }
    
  } catch (error: unknown) {
    console.error('Error processing request:', error);
    const errorMessage = (error instanceof Error) ? error.message : "Failed to process request";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { email: string } }
) {
  const user = await prisma.user.findUnique({
    where: { email: params.email },
    select: { totalCoins: true, usedCoins: true }
  });

  return NextResponse.json(user);
}
