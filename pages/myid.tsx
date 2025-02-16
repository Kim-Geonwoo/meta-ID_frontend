import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from './lib/auth';
import { encrypt } from './lib/crypto';
import EditService from '../components/EditService';
import EditServiceImg from '../components/EditServiceImg';

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
            body: JSON.stringify({ userId: encryptedUserId }),
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
      const encryptedId = encrypt(user.uid);
      setLoading(true);
      try {
        const response = await fetch('/api/deleteservice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userid: encryptedId, ServiceID: serviceId, ShortUrl: shortUrl }),
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
    <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)]">
      <div className="">나의 명함</div>
      {error && <p style={{ color: 'red' }}>오류발생: {error}</p>}
      {services.length === 0 ? (
        <div className="">
          <p>아직 서비스가 없습니다</p>
        </div>
      ) : (
        <div className="bg-slate-300 px-2 py-1.5 border border-slate-400 rounded-md">
          <ul>
            {services.map((service) => (
              <li key={service.shortUrl}>
                <h2 className="font-semibold">{service.name}</h2>
                <p>{service.description}</p>
                <p>{service.shortUrl}</p>
                <EditServiceImg shortUrl={service.shortUrl} />
                <button onClick={() => !loading && confirmDeleteService(service._id, service.shortUrl)} disabled={loading}>
                  {loading ? '삭제 중...' : '삭제'}
                </button>
                <EditService shortUrl={service.shortUrl} />
                <hr className="w-full border-t border-black" />
                <div className="pt-1 pb-0.5">명함 생성일 : <a className="font-medium"> {new Date(service.createdAt).toLocaleString()}</a></div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <br />
      <Link href="/">메인으로</Link>
    </div>
  );
};

export default MyServices;