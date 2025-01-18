import React from 'react';
import { useUser } from './lib/auth';
import Link from 'next/link';

export default function Home() {
  const user = useUser();


  if (!user) return(
    <div>
      <h1>환영합니다 사용자님</h1>
      <Link href="/login">
        <p>로그인 하러가기</p>
      </Link>
    </div>
  );

  return (
    <div>
      <h1>환영합니다 사용자님, {user.email}</h1>
      <div>
        <Link href="/createServices">
          <p>서비스 생성 하러가기</p>
        </Link>
      </div>
    </div>
  );
}