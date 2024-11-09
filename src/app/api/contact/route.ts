import { NextResponse } from 'next/server';
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { prisma } from '@/lib/prisma';
// Server-side Firebase config using environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID || process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase for server-side
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Add to Firestore with error handling
    try {
      await addDoc(collection(db, "contactMessages"), {
        ...data,
        timestamp: serverTimestamp(),
        status: "unread"
      });
    } catch (firestoreError: unknown) {
      console.error('Firestore error:', firestoreError);
      const errorMessage = (firestoreError as Error).message || 'Failed to save to database';
      return NextResponse.json(
        { 
          success: false,
          error: errorMessage
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: "Message sent successfully" 
    });
  } catch (error: unknown) {
    console.error('Error processing contact form:', error);
    const errorMessage = (error instanceof Error) ? error.message : "Failed to send message";
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage
      },
      { status: 500 }
    );
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

  return Response.json(user);
}


// import { prisma } from '@/lib/prisma';

// export async function POST(request: Request) {
//   const { email } = await request.json();

//   const user = await prisma.user.update({
//     where: { email },
//     data: {
//       usedCoins: { increment: 1 }
//     }
//   });

//   return Response.json(user);
// }

