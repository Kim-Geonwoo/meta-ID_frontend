import '../styles/globals.css';
import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from './lib/firebaseClient'; // 미사용이지만, 내버려두기로 하였음.
import { onAuthStateChanged } from 'firebase/auth'; // 미사용이지만, 내버려두기로 하였음.
import type { AppProps } from 'next/app';

// 리캡챠 표시 제거
import "../styles/helloapp.css";

// Stepper 스타일 추가
import "../styles/stepper.css";

import Layout from '../components/Layout';
import {HeroUIProvider} from '@heroui/react'
import PrelineScript from '../components/PrelineScript';



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
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  //     setUser(currentUser);

  //     if (!currentUser) {
  //       router.replace('/helloapp');
  //     }
  //   });

  //   return () => unsubscribe();
  //    // 미사용이지만, 내버려두기로 하였음.
  // }, [router]);

  return (
    <HeroUIProvider>
      <Layout>
        <PrelineScript />
        <div className={ibmPlexSansKR.className}>
          <Component {...pageProps} user={user} />
        </div>
      </Layout>
    </HeroUIProvider>
  )
}

export default MyApp;
