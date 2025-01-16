// 추후, 이미지도 불러오고 수정할수 있도록 개선필요,. 단, 코드 가독성을 위해서, 이미지 관련 코드는 별도의 컴포넌트와 api로 분리하는 것이 좋음.

// 현재 input 값변경시, 취소 버튼의 변동사항 체킹이 제대로 작동하지 않고있음,. 추후, 수정이 필요함.
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../lib/firebaseClient';
import { encrypt } from '../lib/crypto';
import Sortable from 'sortablejs';

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


const EditService: React.FC = () => {
  const router = useRouter();
  const { shortUrl } = router.query;


  const [error, setError] = useState<string | null>(null);
  
  // 저장중, 버튼비활성화 관련
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [message, setMessage] = useState<string | null>(null);

  // 초기 json 데이터 설정.
  const [jsonData, setJsonData] = useState<JsonData | null>(null);
  const [contactData, setContactData] = useState<any | null>(null);
  const [initialJsonData, setInitialJsonData] = useState<JsonData | null>(null);
  const [initialContactData, setInitialContactData] = useState<any | null>(null);


  const [activeTab, setActiveTab] = useState<string>('data'); // 현재 활성화된 탭
  

  const user = auth.currentUser;
  const sortableRef = useRef<HTMLDivElement>(null);

  // json 데이터들 가져오기
  const fetchData = useCallback(async () => {
    try {
      if (!shortUrl || !user) return;


      const encryptedUserId = encrypt(user.uid);
      const response = await fetch(`/api/getServiceData?shortUrl=${shortUrl}&userId=${encryptedUserId}`);
      
      if (!response.ok) {
        throw new Error('데이터를 불러오는 중 오류가 발생했습니다.');
      }
      
      // json 데이터를 기다린후, 전달받았을때 설정하기.
      const data = await response.json();
      setJsonData(data.data);
      setContactData(data.contact);
      setInitialJsonData(data.data);
      setInitialContactData(data.contact);


      // 로컬 스토리지에 데이터 저장
      localStorage.setItem('jsonData', JSON.stringify(data.data));
      localStorage.setItem('contactData', JSON.stringify(data.contact));

      setLoading(false);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  }, [shortUrl, user]);


  // 로컬 스토리지에서 데이터 가져오기
  useEffect(() => {
    const storedJsonData = localStorage.getItem('jsonData');
    const storedContactData = localStorage.getItem('contactData');

    if (storedJsonData && storedContactData) {
      setJsonData(JSON.parse(storedJsonData));
      setContactData(JSON.parse(storedContactData));
      setInitialJsonData(JSON.parse(storedJsonData));
      setInitialContactData(JSON.parse(storedContactData));
      setLoading(false);
    } else {
      fetchData();
    }

    // 페이지에서 나갈 시 로컬 스토리지 데이터 삭제
    return () => {
      localStorage.removeItem('jsonData');
      localStorage.removeItem('contactData');
    };
  }, [fetchData]);




  // Sortable 설정
  const setupSortable = useCallback(() => {
    if (sortableRef.current && jsonData?.items) {
      Sortable.create(sortableRef.current, {
        animation: 150, // 드래그 앤 드롭, 애니메이션 값 설정
        handle: '.drag-handle',
        onStart: () => {
          // 드래그 시작 전에 로컬 스토리지의 내용을 불러와서 갱신
          const storedJsonData = localStorage.getItem('jsonData');
          if (storedJsonData) {
            setJsonData(JSON.parse(storedJsonData));
          }
        },
        onEnd: (evt) => {
          const items = [...jsonData.items];
          const [movedItem] = items.splice(evt.oldIndex, 1);
          items.splice(evt.newIndex, 0, movedItem);

          // UI에서 아이템 위치와 값을 가져오기
          const updatedItems = Array.from(sortableRef.current.children).map((child: any, index) => {
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

          // 로컬 스토리지에 최종 업데이트된 데이터 저장
          localStorage.setItem('jsonData', JSON.stringify(finalJsonData));
        },
      });
    }
  }, [jsonData, setJsonData]);

  // data 탭일때만, SortableJS 설정하기.
  useEffect(() => {
    if (activeTab === 'data') {
      setupSortable();
    }
  }, [setupSortable, activeTab]);

  // input 값 변경 핸들러
  const handleInputChange = (index: number, field: string, value: string) => {
    const newItems = [...jsonData.items];
    newItems[index][field] = value;
    const updatedJsonData = { ...jsonData, items: newItems };
    setJsonData(updatedJsonData);

    // 로컬 스토리지에 업데이트된 데이터 저장
    localStorage.setItem('jsonData', JSON.stringify(updatedJsonData));
  };

  // json데이터 저장로직.
  const handleSave = async () => {
    if (saveLoading) return; // 이미 요청 중이면 중복 클릭 방지
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
        setInitialJsonData(jsonData); // 저장 후 초기 데이터 업데이트
        setInitialContactData(contactData);
      } else {
        setMessage(`서버에러: ${data.message}`);
      }
    } catch (error: any) {
      setMessage(`저장 중 에러: ${error.message}`);
    } finally {
      setSaveLoading(false);
    }
  };

  // 취소할때, 변동사항이 있었으면 팝업띄우기.
  const handleCancel = () => {
    const hasChanges = JSON.stringify(jsonData) !== JSON.stringify(initialJsonData) || JSON.stringify(contactData) !== JSON.stringify(initialContactData);
    if (hasChanges) {
      if (confirm('정말로 취소합니까? 변경사항이 저장되지 않습니다.')) {
        router.push('/myServices');
      }
    } else {
      router.push('/myServices');
    }
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
      {/* 데이터 탭일때. */}
      {activeTab === 'data' ? (
        <>
          {/* <div ref={editorRef} style={{ height: '400px' }}></div>  // json에디터는, 개발용임,. */}
          <div ref={sortableRef} style={{ marginTop: '20px' }}>
            {jsonData?.items.map((item, index) => (
              <div key={item.id} data-id={item.id} style={{ display: 'flex', alignItems: 'center', padding: '10px', border: '1px solid #ccc', marginBottom: '5px' }}>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                  placeholder="Title"
                  style={{ marginRight: '10px' }}
                />
                {item.type === 'description' ? (
                  <textarea
                    value={item.content.join('\n')}
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
                  </>
                )}
                <span className="drag-handle" style={{ cursor: 'grab', marginLeft: 'auto' }}>☰</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div>
          <input // 이름
            type="text"
            value={contactData?.fn || ''}
            onChange={(e) => setContactData({ ...contactData, fn: e.target.value })}
            placeholder="Full Name"
            style={{ marginBottom: '10px', width: '100%' }}
          />
          <input // 생일
            type="text"
            value={contactData?.birthday || ''}
            onChange={(e) => setContactData({ ...contactData, birthday: e.target.value })}
            placeholder="Birthday"
            style={{ marginBottom: '10px', width: '100%' }}
          />
          <input // 전화번호
            type="text"
            value={contactData?.tel || ''}
            onChange={(e) => setContactData({ ...contactData, tel: e.target.value })}
            placeholder="Tel"
            style={{ marginBottom: '10px', width: '100%' }}
          />
          <input // 주소(위치)
            type="text"
            value={contactData?.address || ''}
            onChange={(e) => setContactData({ ...contactData, address: e.target.value })}
            placeholder="Address"
            style={{ marginBottom: '10px', width: '100%' }}
          />
          <input // 회사이름
            type="text"
            value={contactData?.company || ''}
            onChange={(e) => setContactData({ ...contactData, company: e.target.value })}
            placeholder="Company"
            style={{ marginBottom: '10px', width: '100%' }}
          />
          <input // 포지션(직업또는 역할)
            type="text"
            value={contactData?.position || ''}
            onChange={(e) => setContactData({ ...contactData, position: e.target.value })}
            placeholder="Position"
            style={{ marginBottom: '10px', width: '100%' }}
          />
          <input // home 이메일(개인 이메일)
            type="text"
            value={contactData?.email?.home || ''}
            onChange={(e) => setContactData({ ...contactData, email: { ...contactData.email, home: e.target.value } })}
            placeholder="Home Email"
            style={{ marginBottom: '10px', width: '100%' }}
          />
          <input // work 이메일(회사 이메일)
            type="text"
            value={contactData?.email?.work || ''}
            onChange={(e) => setContactData({ ...contactData, email: { ...contactData.email, work: e.target.value } })}
            placeholder="Work Email"
            style={{ marginBottom: '10px', width: '100%' }}
          />
          <input // 개인 웹사이트 URL 주소
            type="text"
            value={contactData?.url || ''}
            onChange={(e) => setContactData({ ...contactData, url: e.target.value })}
            placeholder="URL"
            style={{ marginBottom: '10px', width: '100%' }}
          />
        </div>
      )}
      
      <button onClick={handleSave} disabled={saveLoading}>
        {saveLoading ? '저장 중...' : '저장'}
      </button>
      <button onClick={handleCancel} disabled={saveLoading}>
        취소
      </button>
    </div>
  );
};

export default EditService;