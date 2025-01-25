import React from 'react';
import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useRouter } from 'next/router';
import { auth } from '../pages/lib/firebaseClient';

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
        </form>
      </div>
  );
};