// 추후, 이미지도 불러오고 수정할수 있도록 개선필요,. 단, 코드 가독성을 위해서, 이미지 관련 코드는 별도의 컴포넌트와 api로 분리하는 것이 좋음.
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../lib/firebaseClient';
import { encrypt } from '../lib/crypto';
import JSONEditor from 'jsoneditor';
import Sortable from 'sortablejs';
import 'jsoneditor/dist/jsoneditor.css';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

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

// Zustand 스토어 타입 정의
interface StoreState {
  jsonData: JsonData | null;
  setJsonData: (data: JsonData) => void;
}

// Zustand 스토어 생성
const useJsonStore = create<StoreState>()(
  devtools((set) => ({
    jsonData: null,
    setJsonData: (data) => set({ jsonData: data }),
  }))
);



const EditService: React.FC = () => {
  const router = useRouter();
  const { shortUrl } = router.query;
  
  // Zustand 훅 최적화
  const jsonData = useJsonStore((state) => state.jsonData);
  const setJsonData = useJsonStore((state) => state.setJsonData);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<JsonData | null>(null);
  
  const user = auth.currentUser;
  const editorRef = useRef<HTMLDivElement>(null);
  const sortableRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<JSONEditor | null>(null);

  // 데이터 가져오기 최적화
  const fetchData = useCallback(async () => {
    try {
      if (!shortUrl || !user) return;

      const encryptedUserId = encrypt(user.uid);
      const response = await fetch(`/api/getServiceData?shortUrl=${shortUrl}&userId=${encryptedUserId}`);
      
      if (!response.ok) {
        throw new Error('데이터를 불러오는 중 오류가 발생했습니다.');
      }
      
      const data: JsonData = await response.json();
      setJsonData(data);
      setInitialData(data);
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  }, [shortUrl, user, setJsonData]);

  // 데이터 가져오기 useEffect
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // JSON 에디터 설정
  const setupJsonEditor = useCallback(() => {
    if (jsonData && editorRef.current && !editor) {
      const newEditor = new JSONEditor(editorRef.current, {
        mode: 'code', // 혹은 <  mode: 'text'  > 사용가능
        mainMenuBar: false, // 상단 메뉴바 제거
        onChange: () => {
          setJsonData(newEditor.get()); // JSON 데이터 업데이트
        },
      });
      newEditor.set(jsonData);
      setEditor(newEditor);
    } else if (editor && jsonData) {
      editor.update(jsonData);
    }
  }, [jsonData, editor, setJsonData]);

  // JSON 에디터 useEffect
  useEffect(() => {
    setupJsonEditor();
  }, [setupJsonEditor]);

  // Sortable 설정
  const setupSortable = useCallback(() => {
    if (sortableRef.current && jsonData?.items) {
      Sortable.create(sortableRef.current, {
        animation: 150, // 드래그 앤 드롭, 애니메이션 값 설정
        handle: '.drag-handle',
        onEnd: (evt) => {
          const items = [...jsonData.items];
          const [movedItem] = items.splice(evt.oldIndex, 1);
          items.splice(evt.newIndex, 0, movedItem);
          setJsonData({ ...jsonData, items });
          if (editor) {
            editor.update({ ...jsonData, items });
          }
        },
      });
    }
  }, [jsonData, editor, setJsonData]);

  // Sortable useEffect
  useEffect(() => {
    setupSortable();
  }, [setupSortable]);

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
        body: JSON.stringify(jsonData),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('저장을 완료하였습니다.');
        setInitialData(jsonData); // 저장 후 초기 데이터 업데이트
      } else {
        setMessage(`서버에러: ${data.message}`);
      }
    } catch (error: any) {
      setMessage(`저장 중 에러: ${error.message}`);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    if (JSON.stringify(jsonData) !== JSON.stringify(initialData)) {
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
      <div ref={editorRef} style={{ height: '400px' }}></div>
      <div ref={sortableRef} style={{ marginTop: '20px' }}>
        {jsonData?.items.map((item) => (
          <div key={item.id} data-id={item.id} style={{ display: 'flex', alignItems: 'center', padding: '10px', border: '1px solid #ccc', marginBottom: '5px' }}>
            <span>{item.title}</span>
            <span className="drag-handle" style={{ cursor: 'grab', marginLeft: 'auto' }}>☰</span>
          </div>
        ))}
      </div>
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