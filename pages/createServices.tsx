import React, { useState } from 'react';
import Link from 'next/link';
import { auth } from './lib/firebaseClient';
import { encrypt } from './lib/crypto'; // 경로 수정



const CreateServices = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleCreateServices = async () => {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        alert('User not authenticated');
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
        setMessage(`Error: ${data.message}`);
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const user = auth.currentUser;

  return (
    <div>
      <h1>Create Service</h1>
      <p>User UID: {user ? user.uid : 'your not logged'}</p> 
      <p>Encrypted User UID: {user ? encrypt(user.uid) : 'your not logged'}</p> 
      <input
        type="text"
        placeholder="Service Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Service Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleCreateServices}>Create Service</button>
      {message && <p>{message}</p>}
      <br />
      <Link href="/myServices">생성한 서비스 보러가기</Link>
      <br />
      <Link href="/">메인으로</Link>
    </div>
  );
};

export default CreateServices;
