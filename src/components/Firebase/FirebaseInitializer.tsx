"use client";

import { useEffect } from 'react';
import app from '@/firebase/firebaseConfig';

export function FirebaseInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // This ensures Firebase is initialized
    if (app) console.log('Firebase initialized');
  }, []);

  return <>{children}</>;
}