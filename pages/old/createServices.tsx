// 이전버전의 createServices.tsx 파일입니다.

import React, { useState } from 'react';
import { auth } from '../lib/firebaseClient';
import { encrypt } from '../lib/crypto';
import Link from 'next/link';

const CreateServices = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateServices = async () => {
    if (loading) return; // 이미 요청 중이면 중복 클릭 방지
    setLoading(true);

    try {
      const user = auth.currentUser;

      if (!user) {
        alert('먼저 로그인이 필요합니다.');
        setLoading(false);
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
        setName(''); // name 초기화
        setDescription(''); // description 초기화
      } else {
        setMessage(`서버에러: ${data.message}`);
      }
    } catch (error: any) {
      setMessage(`서비스 생성중 에러: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const user = auth.currentUser;

  return (
    <div>
      <h1>서비스 생성</h1>
      <p>(개발전용) User UID: {user ? user.uid : '로그인필요.'}</p> 
      <p>(개발전용) Encrypted User UID: {user ? encrypt(user.uid) : '로그인필요'}</p>
      <input
        type="text"
        placeholder="서비스 이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        placeholder="서비스 설명"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleCreateServices} disabled={loading}>
        {loading ? '생성 중...' : '생성'}
      </button>
      {message && <p>{message}</p>}
      <br />
      <Link href="/myServices">생성한 서비스 보러가기</Link>
      <br />
      <Link href="/">메인으로</Link>
    </div>
  );
};

export default CreateServices;