import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from './lib/auth';
import { encrypt } from './lib/crypto';

interface Service {
  name: string;
  description: string;
  shortUrl: string;
  createdAt: string;
}

const MyServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const user = useUser();

  useEffect(() => {
    const fetchServices = async () => {
      if (user) {
        const encryptedUserId = encrypt(user.uid);
        try {
          const response = await fetch('/api/getservices', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ encryptedUserId }),
          });

          if (response.ok) {
            const data = await response.json();
            setServices(data);
          } else {
            const data = await response.json();
            setError(data.error);
          }
        } catch (error: any) {
          setError(error.message);
        }
      }
    };

    fetchServices();
  }, [user]);

  return (
    <div>
      <h1>나의 서비스들</h1>
      {error && <p style={{ color: 'red' }}>오류발생: {error}</p>}
      {services.length === 0 ? (
        <div>
          <p>아직 서비스가 없습니다</p>
          <Link href="/createServices">서비스 생성 하러가기</Link>
          <br />
          <Link href="/">메인으로</Link>
        </div>
      ) : (
        <ul>
          {services.map((service) => (
            <li key={service.shortUrl}>
              <h2>{service.name}</h2>
              <p>{service.description}</p>
              <p>{service.shortUrl}</p>
              <p>{new Date(service.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyServices;