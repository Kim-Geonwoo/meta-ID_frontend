import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from './lib/firebaseClient';
import { onAuthStateChanged } from 'firebase/auth';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    /*
    // Listen for changes to auth state (logged in, signed out, etc.)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        router.push('/login');
      }
    });

    return () => unsubscribe(); */
  }, [router]);

  return <Component {...pageProps} user={user} />;
}

export default MyApp;
