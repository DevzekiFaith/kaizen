import { useEffect, useState } from 'react';
import { auth } from './firebaseConfig';
import { User } from 'firebase/auth';

interface AuthHook {
  user: User | null;
  loading: boolean;
}

export const useAuth = (): AuthHook => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
};