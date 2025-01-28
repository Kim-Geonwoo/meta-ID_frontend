import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { encrypt } from '../pages/lib/crypto';
import { auth } from '../pages/lib/firebaseClient';

interface EditServiceImgProps {
  shortUrl: string;
}

const EditServiceImg: React.FC<EditServiceImgProps> = ({ shortUrl }) => {
  const [images, setImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<(File | null)[]>([null, null, null, null]);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null]);
  const user = auth.currentUser;

  const fetchImages = async () => {
    try {
      if (!shortUrl || !user) return;
      const encryptedUserId = encrypt(user.uid);
      const response = await fetch(`/api/getServiceImage?shortUrl=${shortUrl}&userId=${encryptedUserId}`);
      if (!response.ok) {
        throw new Error('이미지를 불러오는 중 오류가 발생했습니다.');
      }
      const data = await response.json();
      setImages(data.images.filter((image: string) => image !== null));
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newImagesCopy = [...newImages];
      newImagesCopy[index] = e.target.files[0];
      setNewImages(newImagesCopy);

      const reader = new FileReader();
      reader.onload = (event) => {
        const newImagesSrc = [...images];
        newImagesSrc[index] = event.target?.result as string;
        setImages(newImagesSrc);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleImageSave = async (index: number) => {
    if (!newImages[index]) return;
    const formData = new FormData();
    formData.append('image', newImages[index]);
    try {
      const encryptedUserId = user ? encrypt(user.uid) : '';
      const response = await fetch(`/api/saveServiceImage?shortUrl=${shortUrl}&userId=${encryptedUserId}&imageIndex=${index}`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        setMessage('이미지 저장을 완료하였습니다.');
        fetchImages();
        setShowImageModal(false);
      } else {
        const data = await response.json();
        setMessage(`이미지 저장 중 에러: ${data.message}`);
      }
    } catch (error: any) {
      setMessage(`이미지 저장 중 에러: ${error.message}`);
    }
  };

  const handleImageCancel = (index: number) => {
    const newImagesCopy = [...newImages];
    newImagesCopy[index] = null;
    setNewImages(newImagesCopy);
    fetchImages();

    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index].value = '';
    }
  };

  return (
    <div>
      {message && <div>{message}</div>}
      <button onClick={() => { setShowImageModal(true); fetchImages(); }}>이미지 수정</button>
      {showImageModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowImageModal(false)}>&times;</span>
            {images.map((image, index) => (
              <div key={index} style={{ marginBottom: '20px' }}>
                <Image src={image} alt={`Service Image ${index + 1}`} layout="responsive" width={500} height={300} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(index, e)}
                  ref={(el) => {
                    fileInputRefs.current[index] = el;
                  }}
                />
                <button onClick={() => handleImageSave(index)}>이미지 저장</button>
                <button onClick={() => handleImageCancel(index)}>취소</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditServiceImg;