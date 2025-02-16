import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { encrypt } from '../pages/lib/crypto';
import { auth } from '../pages/lib/firebaseClient';
import { Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';

interface EditServiceImgProps {
  shortUrl: string;
}

const EditServiceImg: React.FC<EditServiceImgProps> = ({ shortUrl }) => {
  const [images, setImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<(File | null)[]>([null, null, null, null]);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
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
      setHasChanges(true);

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
        setHasChanges(false);
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
    setHasChanges(false);

    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index].value = '';
    }
  };

  const handleNextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const getImageLabel = (index: number) => {
    switch (index) {
      case 0:
        return '슬라이드 이미지 첫번째';
      case 1:
        return '슬라이드 이미지 두번째';
      case 2:
        return '슬라이드 이미지 세번째';
      case 3:
        return '프로필 이미지';
      default:
        return '';
    }
  };

  return (
    <div>
      {message && <div>{message}</div>}
      <Button
        onPress={() => { setShowImageModal(true); fetchImages(); }}
        size="md"
        className="mt-2 w-24 bg-white border border-blue-500 text-slate-800"
      >
        이미지 수정
      </Button>
      {showImageModal && (
        <Modal isOpen={showImageModal} onClose={() => setShowImageModal(false)}>
          <ModalContent>
            <ModalHeader className="bg-gray-300">
              <h1 className="font-semibold text-2xl text-slate-800">이미지 수정하기</h1>
            </ModalHeader>
            <ModalBody className="bg-gray-50">
              <div className="mb-1">
                <span className="font-medium mb-0.5">| {getImageLabel(currentIndex)}</span>
                <Image src={images[currentIndex]} alt={`Service Image ${currentIndex + 1}`} layout="responsive" width={500} height={300} />
                <Input
                  className="mt-2 border rounded-md border-gray-400"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(currentIndex, e)}
                  ref={(el) => {
                    fileInputRefs.current[currentIndex] = el;
                  }}
                />
                <div className="flex justify-between mt-3">
                  <Button onPress={handlePrevImage}>이전</Button>
                  <Button onPress={handleNextImage}>다음</Button>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="bg-gray-300 flex justify-between">
                <Button color="danger" onPress={() => handleImageCancel(currentIndex)} isDisabled={!hasChanges}>변경취소</Button>
                <Button color="primary" onPress={() => handleImageSave(currentIndex)} isDisabled={!hasChanges}>이미지 저장</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default EditServiceImg;