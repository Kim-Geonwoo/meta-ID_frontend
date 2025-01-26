import React from 'react';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import { auth } from '../pages/lib/firebaseClient';
import Link from 'next/link';




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
          <div className="grid gap-y-2">
            <div>
              <div className="relative">
                <input type="email"
                value={email}
                placeholder="이메일"
                onChange={(e) => setEmail(e.target.value)} 
                className="py-1.5 px-2 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" required aria-describedby="email-error" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <Link href="/forgotpassword"><p className="inline-flex items-center gap-x-1 text- text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium">내 비밀번호 찾기</p></Link>
              </div>
              <div className="relative">
                <input type="password"
                value={password}
                placeholder="비밀번호"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$"
                onChange={(e) => setPassword(e.target.value)}
                className="py-1.5 px-2 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" required aria-describedby="password-error" />
              </div>
            </div>
            <button type="submit" className="w-full py-1 px-2 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">로그인</button>
          </div>
        </form>

          {/* 기존 로그인 코드
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
        </form> */}
    </div>
  );
};
