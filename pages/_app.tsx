import '../styles/globals.css';
import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from './lib/firebaseClient'; // 미사용이지만, 내버려두기로 하였음.
import { onAuthStateChanged } from 'firebase/auth'; // 미사용이지만, 내버려두기로 하였음.
import type { AppProps } from 'next/app';

import {HeroUIProvider} from '@heroui/react'

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<any>(null); // SetUser는 미사용이지만, 내버려두기로 하였음.
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

    return () => unsubscribe(); */ // 미사용이지만, 내버려두기로 하였음.
  }, [router]);

  return (
    <HeroUIProvider>
      <Component {...pageProps} user={user} />
    </HeroUIProvider>
  )
}

export default MyApp;
