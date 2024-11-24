// // pages/api/auth/[...nextauth].ts
// import NextAuth from 'next-auth';
// import GoogleProvider from 'next-auth/providers/google'; // Example OAuth provider
// import { FirebaseAdapter } from '@/lib/firebase-adapter'; // Import custom Firebase adapter

// // Define NextAuth options
// const handler = NextAuth({
//   adapter: FirebaseAdapter(), // Use the custom Firebase adapter
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//   ],
//   session: {
//     strategy: 'jwt', // Using JWT-based session strategy
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.email = user.email;
//         token.name = user.name;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id as string;
//         session.user.email = token.email;
//         session.user.name = token.name;
//       }
//       return session;
//     },

//   },
//   pages: {
//     signIn: '/auth/signin', // Custom sign-in page (optional)
//   },
// });

// export { handler as GET, handler as POST };
