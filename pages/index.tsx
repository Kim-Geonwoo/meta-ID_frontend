import React from 'react';
import { useUser } from './lib/auth';
import Link from 'next/link';

export default function Home() {
  const user = useUser();

  if (!user) return <div><p>로그인 필요</p> <Link href="/login"><p>로그인</p></Link></div>;

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      {/* 추가적인 사용자 정보나 기능을 여기에 추가 */}
      <div>
        <Link href="/createServices">
          <p>서비스 생성 하러가기</p>
        </Link>
      </div>
    </div>
  );
}