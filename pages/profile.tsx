// 미완성 코드

import React from 'react';
import { useUser } from './lib/auth';
import Link from 'next/link';



export default function Profile() {
  const user = useUser();
  
  if (!user) return <div><p>로그인 필요</p> <Link href="/login"><p>로그인</p></Link></div>;

  return (
    <div>
      <h1>Profile</h1>
      {user ? (
        <>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
