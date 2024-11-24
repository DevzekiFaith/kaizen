// import { NextResponse } from 'next/server';
// import  auth  from '@/lib/firebase-admin';

// export async function GET(request: Request) {
//   try {
//     const cookieHeader = request.headers.get('cookie');
//     if (!cookieHeader) {
//       return NextResponse.json({ user: null });
//     }

//     const sessionCookie = cookieHeader
//       .split(';')
//       .find(c => c.trim().startsWith('session='))
//       ?.split('=')[1];

//     if (!sessionCookie) {
//       return NextResponse.json({ user: null });
//     }

//     const decodedClaims = await auth.verifySessionCookie(sessionCookie);
//     return NextResponse.json({ 
//       user: {
//         email: decodedClaims.email,
//         uid: decodedClaims.uid
//       }
//     });

//   } catch (error) {
//     console.error('Session verification error:', error);
//     return NextResponse.json({ user: null });
//   }
// }
