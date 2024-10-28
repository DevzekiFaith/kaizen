import { NextResponse } from 'next/server';
import { db } from '@/firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const data = await req.json();
    
    // Add to Firestore
    await addDoc(collection(db, "contactMessages"), {
      ...data,
      timestamp: serverTimestamp(),
      status: "unread"
    });

    return NextResponse.json({ 
      success: true,
      message: "Message sent successfully" 
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to send message" 
      },
      { status: 500 }
    );
  }
}
