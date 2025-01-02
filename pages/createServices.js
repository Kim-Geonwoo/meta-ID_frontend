// pages/createService.js
import { useState, useEffect } from 'react';
import { auth } from './lib/firebaseClient';



export default function CreateService() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleCreateService = async () => {
    if (!user) {
      alert('User not authenticated');
      return;
    }

    const idToken = await user.getIdToken();
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
      },
    });

    if (response.ok) {
      alert('Files uploaded successfully');
    } else {
      alert('File upload failed');
    }
  };

  return (
    <div>
      <h1>Create Service</h1>
      {user ? (
        <div>
          <p>Welcome, {user.uid}</p>
          <button onClick={handleCreateService}>Create Service</button>
        </div>
      ) : (
        <p>Please sign in to create a service.</p>
      )}
    </div>
  );
}