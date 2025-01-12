import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from './lib/auth';
import { encrypt } from './lib/crypto';

interface Service {
  _id: string;
  name: string;
  description: string;
  shortUrl: string;
  createdAt: string;
}

const MyServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
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

  const handleDeleteService = async (serviceId: string, shortUrl: string) => {
    if (user) {
      const encryptedUserId = encrypt(user.uid);
      setLoading(true);
      try {
        const response = await fetch('/api/deleteservice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ encryptedUserId, serviceId, shortUrl }),
        });

        if (response.ok) {
          setServices(services.filter(service => service._id !== serviceId));
        } else {
          const data = await response.json();
          setError(data.error);
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const confirmDeleteService = (serviceId: string, shortUrl: string) => {
    if (confirm('정말로 삭제하시겠습니까?')) {
      handleDeleteService(serviceId, shortUrl);
    }
  };

  return (
    <div>
      <h1>나의 서비스들</h1>
      {error && <p style={{ color: 'red' }}>오류발생: {error}</p>}
      {services.length === 0 ? (
        <div>
          <p>아직 서비스가 없습니다</p>
        </div>
      ) : (
        <ul>
          {services.map((service) => (
            <li key={service.shortUrl}>
              <h2>{service.name}</h2>
              <p>{service.description}</p>
              <p>{service.shortUrl}</p>
              <p>{new Date(service.createdAt).toLocaleString()}</p>
              <button onClick={() => !loading && confirmDeleteService(service._id, service.shortUrl)} disabled={loading}>
                {loading ? '삭제 중...' : '삭제'}
              </button>
            </li>
          ))}
        </ul>
      )}
      <Link href="/createServices">서비스 생성 하러가기</Link>
      <br />
      <Link href="/">메인으로</Link>
    </div>
  );
};

export default MyServices;