import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from './lib/auth';
import { encrypt } from './lib/crypto';
import EditService from '../components/EditService';
import EditServiceImg from '../components/EditServiceImg';
import { Button } from '@heroui/react';

interface Service {
  _id: string;
  name: string;
  description: string;
  shortUrl: string;
  createdAt: string;
}

const Myid = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const user = useUser();

  useEffect(() => {
    const fetchServices = async () => {
      if (user) {
        setLoading(true);
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
        } finally {
          setLoading(false);
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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
      <div className="text-xl font-semibold mb-4">나의 명함</div>
      {error && <p className="text-red-600">오류발생: {error}</p>}
      {loading ? (
        <div className="space-y-4 w-64 h-64 max-w-md p-4">
          {[1,2].map(index => (
            <div key={index} className="p-4 border border-slate-400 rounded-md animate-pulse">
              <div className="h-6 bg-slate-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-slate-300 rounded w-full mb-1"></div>
              <div className="h-4 bg-slate-300 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      ) : services.length === 0 ? (
        <div>
          <p>아직 서비스가 없습니다</p>
        </div>
      ) : (
        <div className="bg-slate-300 px-2 py-1.5 border border-slate-400 rounded-md">
          <ul>
            {services.map((service) => (
              <li key={service.shortUrl} className="flex flex-col mb-1">
                <>
                <div className="flex flex-row justify-between">
                  <h2 className="font-semibold text-lg">{service.name}</h2>
                  <a className="font-light text-lg opacity-40">명함 이름</a>
                </div>
                
                <div className="flex flex-row justify-between">
                  <p className="text-sm">{service.description}</p>
                <a className="font-light text-sm opacity-40">메모</a>
                </div>

                <div className="flex flex-row justify-between">
                  <p className="text-xs text-gray-600">{service.shortUrl}</p>
                  <a className="font-light text-xs opacity-40">짧은 URL</a>
                </div>

                <div className="mt-1 mb-1 flex flex-row space-x-1">
                  <EditService shortUrl={service.shortUrl} />
                  <EditServiceImg shortUrl={service.shortUrl} />
                </div>
                <hr className="w-full border-t border-black my-2" />
                <Button
                  onPress={() => !loading && confirmDeleteService(service._id, service.shortUrl)}
                  disabled={loading}
                  className="mt-0.5 font-medium text-md bg-red-500 text-white py-1 px-2 rounded"
                >
                  {loading ? '삭제 중...' : '삭제'}
                </Button>
                <div className="pt-2 pb-0.5 text-xs">
                  명함 생성일 : <span className="font-medium">{new Date(service.createdAt).toLocaleString()}</span>
                </div>
                </>
              </li>
            ))}
          </ul>
        </div>
      )}
      <br />
      <Link href="/">
        <p className="underline text-blue-600">메인으로</p>
      </Link>
    </div>
  );
};

export default Myid;