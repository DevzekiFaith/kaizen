import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin'; // Correct Firebase Admin import
import { prisma} from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Define types for request headers and user claims
type CookieHeader = string | null;

type DecodedClaims = {
  email: string;
};


// Type definition for the POST request
export type PostRequest = Request;

// Type definition for the result of the Prisma transaction
export type TransactionResult = {
  availableCoins: number;
  usedCoins: number;
};

// Function to handle the POST request logic
export async function POST(request: PostRequest): Promise<NextResponse> {
  try {
    // Extract cookie from request headers
    const cookieHeader: CookieHeader = request.headers.get('cookie');

    if (!cookieHeader) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Extract the session cookie from the cookie header
    const sessionCookie: string | undefined = cookieHeader
      .split(';')
      .find((c) => c.trim().startsWith('session='))?.split('=')[1];

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Initialize Firebase Admin if it's not already initialized
    if (!admin.apps.length) {
      admin.initializeApp();
    }

    // Verify session cookie using Firebase Admin's verifySessionCookie
    const decodedClaims: DecodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);

    // Perform the database transaction to update user coins using Prisma
    const result: TransactionResult = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Find user based on decoded email
      const user = await tx.user.findUnique({
        where: { email: decodedClaims.email },
        select: { availableCoins: true }, // Fetch only the necessary field
      });

      // If no user found or insufficient coins, throw error
      if (!user || user.availableCoins <= 0) {
        throw new Error('Insufficient coins');
      }

      // Update the user's coin balance: decrement availableCoins, increment usedCoins
      return await tx.user.update({
        where: { email: decodedClaims.email },
        data: {
          availableCoins: { decrement: 1 },
          usedCoins: { increment: 1 },
        },
        select: { availableCoins: true, usedCoins: true }, // Fetch only the updated fields
      });
    });

    // Return a successful response with the updated coin values
    return NextResponse.json({
      success: true,
      availableCoins: result.availableCoins,
      usedCoins: result.usedCoins,
    });
  } catch (error) {
    // Handle errors appropriately and provide more detailed information in logs
    const errorMessage: string = error instanceof Error ? error.message : 'Internal Server Error';
    const statusCode: number = errorMessage === 'Insufficient coins' ? 403 : 400;

    console.error('Error in /api/coins/use:', errorMessage); // Log error details for debugging
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
