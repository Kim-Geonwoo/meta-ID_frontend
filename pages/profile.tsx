// 미완성 코드

import React from 'react';
import { useUser } from './lib/auth';
import Link from 'next/link';



export default function Profile() {
  const user = useUser();
  
  if (!user) return <div><p>로그인 필요</p> <Link href="/login"><p>로그인</p></Link></div>;

  return (
    <div>
      <h1>유저 프로필</h1>
      {user ? (
        <>
          <p>유저이름: {user.username}</p>
          <p>이메일: {user.email}</p>
        </>
      ) : (
        <p>먼저 로그인이 필요합니다.</p>
      )}
    </div>
  );
}
