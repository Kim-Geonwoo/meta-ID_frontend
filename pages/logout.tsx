import React from "react";
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import { auth } from './lib/firebaseClient';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      await signOut(auth);
      router.push('/'); // 로그아웃 후, 메인페이지로 자동이동.
    };
    logout();
  }, [router]);

  return <p>로그아웃 중...</p>;
}