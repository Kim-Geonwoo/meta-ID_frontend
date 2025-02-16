import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../pages/lib/firebaseClient';
import { encrypt } from '../pages/lib/crypto';
import EditServiceImg from './EditServiceImg';
import ChangeIcon from './ChangeIcon';
import { Button, Input, Tab, Tabs } from "@heroui/react";
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface JsonItem {
  id: string;
  title: string;
  icon?: string;
  link?: string;
  content?: string;
  type: string;
}

interface JsonData {
  items: JsonItem[];
}

interface EditServiceProps {
  shortUrl: string;
}

// 드래그 가능한 아이템 컴포넌트
interface DraggableItemProps {
  item: JsonItem;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  handleInputChange: (index: number, field: string, value: string) => void;
  handleDeleteItem: (index: number) => void;
}
const DraggableItem: React.FC<DraggableItemProps> = ({ item, index, moveItem, handleInputChange, handleDeleteItem }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag({
    type: 'ITEM',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const [, drop] = useDrop({
    accept: 'ITEM',
    hover: (dragged: { index: number }) => {
      if (dragged.index !== index) {
        moveItem(dragged.index, index);
        dragged.index = index;
      }
    },
  });
  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move', display: 'flex', alignItems: 'center' }}
      data-id={item.id}
    >
      {item.type === 'description' ? (
        <>
          <Input
            type="text"
            value={item.title}
            onChange={(e) => handleInputChange(index, 'title', e.target.value)}
            placeholder="제목"
            size="sm"
            className="w-[4rem] mr-0.5 h-8"
          />
          <textarea
            value={item.content}
            onChange={(e) => handleInputChange(index, 'content', e.target.value)}
            placeholder="내용"
            className=""
          />
        </>
      ) : (
        <>
          <Input
            type="text"
            value={item.title}
            onChange={(e) => handleInputChange(index, 'title', e.target.value)}
            placeholder="링크"
            size="sm"
            className="w-[4rem] mr-0.5 h-8"
          />
          <ChangeIcon
            selectedIcon={item.icon}
            onIconSelect={(icon) => handleInputChange(index, 'icon', icon)}
          />
          <Input
            type="text"
            value={item.link}
            onChange={(e) => handleInputChange(index, 'link', e.target.value)}
            placeholder="Link"
            size="sm"
            className="w-[10rem] ml-0.5 h-8"
          />
        </>
      )}
      <button onClick={() => handleDeleteItem(index)} style={{ marginLeft: '10px' }}>
        삭제
      </button>
      <span className="drag-handle" style={{ cursor: 'grab', marginLeft: 'auto' }}>☰</span>
    </div>
  );
};

const EditService: React.FC<EditServiceProps> = ({ shortUrl }) => {
  const [error, setError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [cancelLoading, setCancelLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [jsonData, setJsonData] = useState<JsonData | null>(null);
  const [contactData, setContactData] = useState<any | null>(null);
  const [initialJsonData, setInitialJsonData] = useState<JsonData | null>(null);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [initialContactData, setInitialContactData] = useState<any | null>(null);
  const [selected, setSelected] = useState<string>('data');
  const user = auth.currentUser;

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

  const moveItem = (from: number, to: number) => {
    const items = [...jsonData.items];
    const [removed] = items.splice(from, 1);
    items.splice(to, 0, removed);
    const reIndexedItems = items.map((item, index) => ({ ...item, id: index.toString() }));
    const updatedJsonData = { ...jsonData, items: reIndexedItems };
    setJsonData(updatedJsonData);
    localStorage.setItem(`jsonData_${shortUrl}`, JSON.stringify(updatedJsonData));
    setHasChanges(true);
  };

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

  const handleAddItem = (type: string) => {
    let newItem: JsonItem;
    if (type === 'link') {
      newItem = { id: '', title: '', icon: '', link: '', type };
    } else if (type === 'description') {
      newItem = { id: '', title: '', content: '', type };
    } else {
      newItem = { id: '', title: '', type };
    }
  
    const updatedItems = [...(jsonData?.items || []), newItem];
    const reIndexedItems = updatedItems.map((item, index) => ({ ...item, id: index.toString() }));
    const updatedJsonData = { ...(jsonData || { items: [] }), items: reIndexedItems };
    setJsonData(updatedJsonData);
    localStorage.setItem(`jsonData_${shortUrl}`, JSON.stringify(updatedJsonData));
    setHasChanges(true);
  };
  
  const handleDeleteItem = (index: number) => {
    const updatedItems = [...jsonData.items];
    updatedItems.splice(index, 1);
    const reIndexedItems = updatedItems.map((item, index) => ({ ...item, id: index.toString() }));
    const updatedJsonData = { ...jsonData, items: reIndexedItems };
    setJsonData(updatedJsonData);
    localStorage.setItem(`jsonData_${shortUrl}`, JSON.stringify(updatedJsonData));
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
      <Tabs aria-label="Options" selectedKey={selected} onSelectionChange={(key) => setSelected(key as string)}>
        <Tab key="data" title="Data">
          <>
            <div className="flex flex-row justify-end space-x-1 my-1">
              <Button color="primary" size="sm" onPress={() => handleAddItem('link')}>링크추가</Button>
              <Button color="primary" size="sm" onPress={() => handleAddItem('description')}>설명추가</Button>
            </div>
            <DndProvider backend={HTML5Backend}>
              <div className="flex flex-col space-y-1 my-1">
                {jsonData?.items.map((item, index) => (
                  <DraggableItem 
                    key={item.id}
                    item={item}
                    index={index}
                    moveItem={moveItem}
                    handleInputChange={handleInputChange}
                    handleDeleteItem={handleDeleteItem}
                  />
                ))}
              </div>
            </DndProvider>
          </>
        </Tab>
        <Tab key="contact" title="Contact">
          <div className="flex flex-col">
            <input
              type="text"
              value={contactData?.fn || ''}
              onChange={(e) => handleContactChange('fn', e.target.value)}
              placeholder="Full Name"
              className="mb-2 w-64"
            />
            <input
              type="text"
              value={contactData?.birthday || ''}
              onChange={(e) => handleContactChange('birthday', e.target.value)}
              placeholder="Birthday"
              className="mb-2 w-64"
            />
            <input
              type="text"
              value={contactData?.tel || ''}
              onChange={(e) => handleContactChange('tel', e.target.value)}
              placeholder="Tel"
              className="mb-2 w-64"
            />
            <input
              type="text"
              value={contactData?.address || ''}
              onChange={(e) => handleContactChange('address', e.target.value)}
              placeholder="Address"
              className="mb-2 w-64"
            />
            <input
              type="text"
              value={contactData?.company || ''}
              onChange={(e) => handleContactChange('company', e.target.value)}
              placeholder="Company"
              className="mb-2 w-64"
            />
            <input
              type="text"
              value={contactData?.position || ''}
              onChange={(e) => handleContactChange('position', e.target.value)}
              placeholder="Position"
              className="mb-2 w-64"
            />
            <input
              type="text"
              value={contactData?.email?.home || ''}
              onChange={(e) => handleContactChange('email.home', e.target.value)}
              placeholder="Home Email"
              className="mb-2 w-64"
            />
            <input
              type="text"
              value={contactData?.email?.work || ''}
              onChange={(e) => handleContactChange('email.work', e.target.value)}
              placeholder="Work Email"
              className="mb-2 w-64"
            />
            <input
              type="text"
              value={contactData?.url || ''}
              onChange={(e) => handleContactChange('url', e.target.value)}
              placeholder="URL"
              className="mb-2 w-64"
            />
          </div>
        </Tab>
      </Tabs>
      <div className="mt-2 mb-1 space-x-1 flex flex-row justify-end">
        <Button color="primary" size="sm" onPress={handleSave} isDisabled={saveLoading || cancelLoading}>
          {saveLoading ? '저장 중...' : '저장'}
        </Button>
        <Button color="primary" size="sm" onPress={handleCancel} isDisabled={saveLoading || cancelLoading}>
          {cancelLoading ? '취소 중...' : '취소'}
        </Button>
      </div>
    </div>
  );
};

export default EditService;