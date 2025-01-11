import React from 'react';
import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useRouter } from 'next/router';
import { auth } from './lib/firebaseClient';

// 랜덤한 6자리 문자열 생성 함수
function RandomId(length) {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const SignUp = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dbError, setDbError] = useState('');
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
        const userRandomId = RandomId(6);
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
          alert('Sign up successful! Redirecting to login page...');
          router.push('/login'); // 회원가입 성공 후 로그인 페이지로 리디렉션
        } else {
          const data = await response.json();
          alert(`Error: ${data.error}`);
        }
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      {dbError && <p style={{ color: 'red' }}>Database connection error: {dbError}</p>}
      <form onSubmit={handleSignUp}>
        <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
