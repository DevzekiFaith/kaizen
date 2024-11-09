'use client'

import React from 'react';
import { ThemeProvider } from "@/components/Theme-Provider/Theme-Provider";
import { FirebaseInitializer } from "@/components/Firebase/FirebaseInitializer";
import Whatsapp from "@/components/whatsapp/Whatsapp";
import { SessionProvider } from "next-auth/react";
import { Toaster } from 'react-hot-toast';

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <FirebaseInitializer>
          {children}
          <Toaster position="top-right" />
        </FirebaseInitializer>
        <Whatsapp />
      </ThemeProvider>
    </SessionProvider>
  );
}
