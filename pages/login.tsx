import React from "react";
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import { auth } from './lib/firebaseClient';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/'); // 로그인 후, 메인페이지로 자동이동.
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h1>로그인 페이지</h1>
      <form onSubmit={handleLogin}>
        <label>
          이메일:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <br />
        <label>
          비밀번호:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <button type="submit">로그인</button>
      </form>
    </div>
  );
}
