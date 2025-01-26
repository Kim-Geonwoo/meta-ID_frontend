import React from 'react';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import { auth } from '../pages/lib/firebaseClient';




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
    <div className="flex flex-col w-[16rem] h-26 items-center justify-center">
        <form onSubmit={handleLogin}>
            <input type="email"
            value={email}
            placeholder="이메일"
            onChange={(e) => setEmail(e.target.value)} />
            <br />
            <input type="password"
            value={password}
            placeholder="비밀번호"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$"
            onChange={(e) => setPassword(e.target.value)} />
            <br />
            <button type="submit">로그인</button>
        </form>
    </div>
  );
};
