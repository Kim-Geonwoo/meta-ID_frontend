import '../styles/globals.css';
import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from './lib/firebaseClient'; // 미사용이지만, 내버려두기로 하였음.
import { onAuthStateChanged } from 'firebase/auth'; // 미사용이지만, 내버려두기로 하였음.
import type { AppProps } from 'next/app';



import Layout from '../components/Layout';
import {HeroUIProvider} from '@heroui/react'



// 리믹스 아이콘 패키지추가
import 'remixicon/fonts/remixicon.css'

// IBM Plex Sans KR 폰트 추가
import { IBM_Plex_Sans_KR } from 'next/font/google';

const ibmPlexSansKR = IBM_Plex_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  // 300: Light, 400: Regular, 500: Medium, 600: SemiBold
});


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
      <Layout>
      <div className={ibmPlexSansKR.className}>
        <Component {...pageProps} user={user} />
      </div>
      </Layout>
    </HeroUIProvider>
  )
}

export default MyApp;
