import React, { useState } from 'react';
import Link from 'next/link';
import { auth } from './lib/firebaseClient';
import { encrypt } from './lib/crypto';


const CreateServices = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleCreateServices = async () => {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        alert('먼저 로그인이 필요합니다.');
        return;
      }

      const encryptedUserId = encrypt(user.uid);
      const response = await fetch('/api/createservices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: encryptedUserId, name, description }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(`서버에러: ${data.message}`);
      }
    } catch (error: any) {
      setMessage(`서비스 생성중 에러: ${error.message}`);
    }
  };

  const user = auth.currentUser;

  return (
    <div>
      <h1>서비스 생성 페이지</h1>
      <p>User UID: {user ? user.uid : '로그인필요.'}</p> 
      <p>Encrypted User UID: {user ? encrypt(user.uid) : '로그인필요'}</p>
      <input
        type="text"
        placeholder="서비스 이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="서비스 설명"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleCreateServices}>서비스 생성</button>
      {message && <p>{message}</p>}
      <br />
      <Link href="/myServices">생성한 서비스 보러가기</Link>
      <br />
      <Link href="/">메인으로</Link>
    </div>
  );
};

export default CreateServices;
