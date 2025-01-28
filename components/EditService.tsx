import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../pages/lib/firebaseClient';
import { encrypt } from '../pages/lib/crypto';
import Sortable from 'sortablejs';
import EditServiceImg from './EditServiceImg';
import { Input } from '@heroui/react';

// 타입 정의
interface JsonItem {
  id: string;
  title: string;
  [key: string]: any;
}

interface JsonData {
  items: JsonItem[];
  [key: string]: any;
}

interface EditServiceProps {
  shortUrl: string;
}

const EditService: React.FC<EditServiceProps> = ({ shortUrl }) => {
  const [error, setError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [cancelLoading, setCancelLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [jsonData, setJsonData] = useState<JsonData | null>(null);
  const [contactData, setContactData] = useState<any | null>(null);
  const [initialJsonData, setInitialJsonData] = useState<JsonData | null>(null);
  const [initialContactData, setInitialContactData] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<string>('data');
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const user = auth.currentUser;
  const sortableRef = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(async () => {
    try {
      if (!shortUrl || !user) return;
      const encryptedUserId = encrypt(user.uid);
      const response = await fetch(`/api/getServiceData?shortUrl=${shortUrl}&userId=${encryptedUserId}`);
      if (!response.ok) {
        throw new Error('데이터를 불러오는 중 오류가 발생했습니다.');
      }
      const data = await response.json();
      setJsonData(data.data);
      setContactData(data.contact);
      setInitialJsonData(data.data);
      setInitialContactData(data.contact);
      localStorage.setItem(`jsonData_${shortUrl}`, JSON.stringify(data.data));
      localStorage.setItem(`contactData_${shortUrl}`, JSON.stringify(data.contact));
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  }, [shortUrl, user]);

  useEffect(() => {
    const storedJsonData = localStorage.getItem(`jsonData_${shortUrl}`);
    const storedContactData = localStorage.getItem(`contactData_${shortUrl}`);
    if (storedJsonData && storedContactData) {
      setJsonData(JSON.parse(storedJsonData));
      setContactData(JSON.parse(storedContactData));
      setInitialJsonData(JSON.parse(storedJsonData));
      setInitialContactData(JSON.parse(storedContactData));
      setLoading(false);
    } else {
      fetchData();
    }
    return () => {
      localStorage.removeItem(`jsonData_${shortUrl}`);
      localStorage.removeItem(`contactData_${shortUrl}`);
    };
  }, [fetchData, shortUrl]);

  const setupSortable = useCallback(() => {
    if (sortableRef.current && jsonData?.items) {
      Sortable.create(sortableRef.current, {
        animation: 150,
        handle: '.drag-handle',
        onStart: () => {
          const storedJsonData = localStorage.getItem(`jsonData_${shortUrl}`);
          if (storedJsonData) {
            setJsonData(JSON.parse(storedJsonData));
          }
        },
        onEnd: (evt) => {
          const items = [...jsonData.items];
          const [movedItem] = items.splice(evt.oldIndex, 1);
          items.splice(evt.newIndex, 0, movedItem);
          const updatedItems = Array.from(sortableRef.current.children).map((child: any) => {
            const id = child.getAttribute('data-id');
            const title = child.querySelector('input[type="text"]').value;
            const content = child.querySelector('textarea')?.value.split('\n') || [];
            const icon = child.querySelector('input[placeholder="Icon"]')?.value || '';
            const link = child.querySelector('input[placeholder="Link"]')?.value || '';
            const type = jsonData.items.find(item => item.id === id)?.type;
            if (type === 'description') {
              return { id, title, content, type };
            } else {
              return { id, title, content, icon, link, type };
            }
          });
          const finalJsonData = { ...jsonData, items: updatedItems };
          setJsonData(finalJsonData);
          localStorage.setItem(`jsonData_${shortUrl}`, JSON.stringify(finalJsonData));
          setHasChanges(true);
        },
      });
    }
  }, [jsonData, setJsonData, shortUrl]);

  useEffect(() => {
    if (activeTab === 'data') {
      setupSortable();
    }
  }, [setupSortable, activeTab]);

  const handleInputChange = (index: number, field: string, value: string) => {
    const newItems = [...jsonData.items];
    newItems[index][field] = value;
    const updatedJsonData = { ...jsonData, items: newItems };
    setJsonData(updatedJsonData);
    localStorage.setItem(`jsonData_${shortUrl}`, JSON.stringify(updatedJsonData));
    setHasChanges(true);
  };

  const handleContactChange = (field: string, value: string) => {
    const updatedContactData = { ...contactData, [field]: value };
    setContactData(updatedContactData);
    localStorage.setItem(`contactData_${shortUrl}`, JSON.stringify(updatedContactData));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (saveLoading || cancelLoading) return;
    setSaveLoading(true);
    setMessage(null);
    try {
      const encryptedUserId = user ? encrypt(user.uid) : '';
      const response = await fetch(`/api/saveServiceData?shortUrl=${shortUrl}&userId=${encryptedUserId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: jsonData, contact: contactData }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('저장을 완료하였습니다.');
        setInitialJsonData(jsonData);
        setInitialContactData(contactData);
        setHasChanges(false);
      } else {
        setMessage(`서버에러: ${data.message}`);
      }
    } catch (error: any) {
      setMessage(`저장 중 에러: ${error.message}`);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancel = async () => {
    if (cancelLoading || saveLoading) return;
    setCancelLoading(true);
    setMessage(null);
    if (hasChanges) {
      if (confirm('정말로 취소합니까? 변경사항이 저장되지 않습니다.')) {
        await fetchData();
        setMessage('취소를 완료하였습니다.');
        setHasChanges(false);
      }
    } else {
      setMessage('변경된 내용이 없습니다.');
    }
    setCancelLoading(false);
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;

  return (
    <div>
      {message && <div>{message}</div>}
      <div>
        <button onClick={() => setActiveTab('data')} disabled={activeTab === 'data'}>Data</button>
        <button onClick={() => setActiveTab('contact')} disabled={activeTab === 'contact'}>Contact</button>
      </div>
      {activeTab === 'data' ? (
        <>
          <div ref={sortableRef} style={{ marginTop: '20px' }}>
            {jsonData?.items.map((item, index) => (
              <div key={item.id}
              data-id={item.id}
              className="">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                  placeholder="Title"
                  style={{ marginRight: '10px' }}
                />
                {item.type === 'description' ? (
                  <textarea
                    value={item.content}
                    onChange={(e) => handleInputChange(index, 'content', e.target.value)}
                    placeholder="Content"
                    style={{ marginRight: '10px' }}
                  />
                ) : (
                  <>
                    <input
                      type="text"
                      value={item.icon}
                      onChange={(e) => handleInputChange(index, 'icon', e.target.value)}
                      placeholder="Icon"
                      style={{ marginRight: '10px' }}
                    />
                    <input
                      type="text"
                      value={item.link}
                      onChange={(e) => handleInputChange(index, 'link', e.target.value)}
                      placeholder="Link"
                      style={{ marginRight: '10px' }}
                    />
                    <Input
                      endContent={
                        <div className="pointer-events-none flex items-center">
                          <span className="text-default-400 text-small">.org</span>
                        </div>
                      }
                      label="Website" 
                      placeholder="heroui"
                      startContent={
                        <div className="pointer-events-none flex items-center">
                          <span className="text-default-400 text-small">https://</span>
                        </div>
                      }
                      type="url"
                    />
                  </>
                )}
                <span className="drag-handle" style={{ cursor: 'grab', marginLeft: 'auto' }}>☰</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div>
          <input
            type="text"
            value={contactData?.fn || ''}
            onChange={(e) => handleContactChange('fn', e.target.value)}
            placeholder="Full Name"
            style={{ marginBottom: '10px', width: '100%' }}
          />
          <input
            type="text"
            value={contactData?.birthday || ''}
            onChange={(e) => handleContactChange('birthday', e.target.value)}
            placeholder="Birthday"
            style={{ marginBottom: '10px', width: '100%' }}
          />
          <input
            type="text"
            value={contactData?.tel || ''}
            onChange={(e) => handleContactChange('tel', e.target.value)}
            placeholder="Tel"
            style={{ marginBottom: '10px', width: '100%' }}
          />
          <input
            type="text"
            value={contactData?.address || ''}
            onChange={(e) => handleContactChange('address', e.target.value)}
            placeholder="Address"
            style={{ marginBottom: '10px', width: '100%' }}
          />
          <input
            type="text"
            value={contactData?.company || ''}
            onChange={(e) => handleContactChange('company', e.target.value)}
            placeholder="Company"
            style={{ marginBottom: '10px', width: '100%' }}
          />
          <input
            type="text"
            value={contactData?.position || ''}
            onChange={(e) => handleContactChange('position', e.target.value)}
            placeholder="Position"
            style={{ marginBottom: '10px', width: '100%' }}
          />
          <input
            type="text"
            value={contactData?.email?.home || ''}
            onChange={(e) => handleContactChange('email.home', e.target.value)}
            placeholder="Home Email"
            style={{ marginBottom: '10px', width: '100%' }}
          />
          <input
            type="text"
            value={contactData?.email?.work || ''}
            onChange={(e) => handleContactChange('email.work', e.target.value)}
            placeholder="Work Email"
            style={{ marginBottom: '10px', width: '100%' }}
          />
          <input
            type="text"
            value={contactData?.url || ''}
            onChange={(e) => handleContactChange('url', e.target.value)}
            placeholder="URL"
            style={{ marginBottom: '10px', width: '100%' }}
          />
        </div>
      )}
      <button onClick={handleSave} disabled={saveLoading || cancelLoading}>
        {saveLoading ? '저장 중...' : '저장'}
      </button>
      <button onClick={handleCancel} disabled={saveLoading || cancelLoading}>
        {cancelLoading ? '취소 중...' : '취소'}
      </button>
    </div>
  );
};

export default EditService;