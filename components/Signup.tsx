import React from 'react';
import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useRouter } from 'next/router';
import { auth } from '../pages/lib/firebaseClient';
import Link from 'next/link';

// 유저 고유ID를 위한, 랜덤 문자열 생성 함수.
function RandomId(length) {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}



export default function Signup() {

    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dbError] = useState('');
    const router = useRouter();

    const handleSignUp = async (event: React.FormEvent) => {
        event.preventDefault();
    
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          if (user) {
            await updateProfile(user, {
              displayName: userName,
            });
            const userRandomId = RandomId(6); // 유저 고유ID를 위한, 문자열 길이는 6자리.
            const response = await fetch('/api/createuser', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userid: userRandomId,
                username: userName,
                email: user.email,
              }),
            });
    
            if (response.ok) {
              alert('회원가입이 완료되었습니다! 로그인페이지로 이동합니다.');
              router.push('/login'); // 회원가입 성공 후, 로그인페이지로 자동이동.
            } else {
              const data = await response.json();
              alert(`회원가입 중, 오류발생: ${data.error}`);
            }
          }
        } catch (error: any) {
          alert(error.message);
        }
    };

      
  return (
      <div className="flex flex-col w-[16rem] h-26 items-center justify-center">
        {dbError && <p style={{ color: 'red' }}>데이터베이스 연결오류 발생: {dbError}</p>}
        <form onSubmit={handleSignUp}>
          <div className="grid gap-y-2">
            <div>
              <div className="relative">
                <input type="text"
                placeholder="사용자 이름"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="py-1.5 px-2 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" required/>
              </div>
            </div>

            <div>
              <div className="relative">
                <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="py-1.5 px-2 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" required />
              </div>
            </div>
            <div>
              <div className="relative">
                <input type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="py-1.5 px-2 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" required />
              </div>
            </div>
            <button type="submit" className="w-full py-1 px-2 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">로그인</button>
          </div>
        </form>


          
          {/* <form onSubmit={handleSignUp}>
            <input
            type="text"
            placeholder="사용자 이름"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            />
            <br />
            <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <button type="submit">회원가입</button>
        </form> */}
      </div>
  );
};