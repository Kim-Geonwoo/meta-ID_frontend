import React, { useState } from 'react';
import path from 'path';
import axios from 'axios';
import { encrypt } from '../pages/lib/crypto';
import { useUser } from '../pages/lib/auth';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalProps,
  Button,
  useDisclosure,
  RadioGroup,
  Radio,
} from "@heroui/react";

import Stepper, { Step } from './CreateStepper';
import Image from 'next/image';



// CreateServiceStepper 컴포넌트
export default function CreateServiceStepper() {

  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  
  const [loading, setLoading] = useState(false);
  const [serviceName, setServiceName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [linkItems, setLinkItems] = useState([]);
  const [contact, setContact] = useState({
    address: '',
    birthday: '',
    company: '',
    email: { home: '', work: '' },
    fn: '',
    position: '',
    tel: '',
    url: ''
  });

  const [images, setImages] = useState({
    profile: null,
    carousel1: null,
    carousel2: null,
    carousel3: null
  });

  const handleAddLinkItem = (type = 'link') => {
    if (type === 'link') {
      setLinkItems([...linkItems, { id: '', title: '', icon: '', link: '', type }]);
    } else if (type === 'description') {
      setLinkItems([...linkItems, { id: '', title: '', content: '', type }]);
    }
  };

  const handleImageChange = (e, imageName) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prevImages) => ({
          ...prevImages,
          [imageName]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const user = useUser(); // 현재 인증된 사용자 가져오기

  const downloadImageAsBuffer = async (url) => {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString('base64');
    return `data:image/webp;base64,${base64String}`;
  };

  const handleSaveService = async () => {
    if (!serviceName || !serviceDescription) {
      alert('서비스 이름과 설명을 입력해주세요.');
      return;
    }

    if (loading) return; // 이미 요청 중이면 중복 클릭 방지
    setLoading(true);
    
    const dataJson = {
      items: linkItems
    };

    const contactJson = contact;

    try {
      
      const encryptedUserId = encrypt(user.uid)

      const sampleImages = {
        profile: 'https://i.ibb.co/ygMhFzG/meta-id-front-profile.webp',
        carousel1: 'https://i.ibb.co/48FBMN7/meta-id-front-carousel-1.webp',
        carousel2: 'https://i.ibb.co/YBKRS21/meta-id-front-carousel-2.webp',
        carousel3: 'https://i.ibb.co/Dp6Qv0x/meta-id-front-carousel-3.webp'
      };

      const imagesToSend = {
        profile: images.profile || await downloadImageAsBuffer(sampleImages.profile),
        carousel1: images.carousel1 || await downloadImageAsBuffer(sampleImages.carousel1),
        carousel2: images.carousel2 || await downloadImageAsBuffer(sampleImages.carousel2),
        carousel3: images.carousel3 || await downloadImageAsBuffer(sampleImages.carousel3)
      };

      await axios.post('/api/upload', {
        data: dataJson,
        contact: contactJson,
        name: serviceName,
        description: serviceDescription,
        encryptUserId : encryptedUserId,
        images: [
          { fileName: 'profile.webp', fileContent: imagesToSend.profile },
          { fileName: 'carousel_1.webp', fileContent: imagesToSend.carousel1 },
          { fileName: 'carousel_2.webp', fileContent: imagesToSend.carousel2 },
          { fileName: 'carousel_3.webp', fileContent: imagesToSend.carousel3 }
        ]
      });
      alert('서비스가 저장되었습니다.');
    } catch (error) {
      console.error('Error saving service:', error);
      alert('서비스 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const [selectedIcon, setSelectedIcon] = useState('');

  const handleIconSelect = (icon) => {
    setSelectedIcon(icon);
  };

  return (
    
    <div className="w-[22rem]">
      
  
  <Stepper
    initialStep={1}
    onStepChange={(step) => {
      console.log(step);
      
    }}
    onFinalStepCompleted={handleSaveService}
    backButtonText="이전"
    nextButtonText="다음"
  >
    <Step>
    <div className="">
                  <input
                    type="text"
                    value={serviceName}
                    placeholder="서비스 이름"
                    className="mb-3 py-1.5 px-2 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    onChange={(e) => setServiceName(e.target.value)}
                  />
                </div>
                <div>
                  
                  <textarea
                    value={serviceDescription}
                    placeholder="서비스 이름"
                    className="py-1.5 px-2 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    onChange={(e) => setServiceDescription(e.target.value)}
                  />
                </div>
    </Step>
    <Step>
      <div className="flex flex-col gap-y-1.5">
        <form>
          <label htmlFor="profile_img"
            className="block w-full bg-white text-black border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none
            file:bg-gray-50 file:border-0
            file:me-4
            file:py-1.5 file:px-2">
            프로필이미지</label>
          <input
          type="file"
          accept="image/*"
          id="profile_img"
          style={{ display: "none" }}
          onChange={(e) => handleImageChange(e, 'profile')}
          />
        </form>
        <form>
          <label htmlFor="carousel1_img"
            className="block w-full bg-white text-black border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none
            file:bg-gray-50 file:border-0
            file:me-4
            file:py-1.5 file:px-2">
            슬라이드 이미지 1</label>
          <input
          type="file"
          accept="image/*"
          id="carousel1_img"
          style={{ display: "none" }}
          onChange={(e) => handleImageChange(e, 'carousel1')}
          />
        </form>
        <form>
          <label htmlFor="carousel2_img"
            className="block w-full bg-white text-black border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none
            file:bg-gray-50 file:border-0
            file:me-4
            file:py-1.5 file:px-2">
            슬라이드 이미지 2</label>
          <input
          type="file"
          id="carousel2_img"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => handleImageChange(e, 'carousel2')}
          />
        </form>
        <form>
          <label htmlFor="carousel3_img"
            className="block w-full bg-white text-black border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none
            file:bg-gray-50 file:border-0
            file:me-4
            file:py-1.5 file:px-2">
            슬라이드 이미지 3</label>
          <input
          type="file"
          accept="image/*"
          id="carousel3_img"
          style={{ display: "none" }}
          onChange={(e) => handleImageChange(e, 'carousel3')}
          />
        </form>
      </div>
    </Step>
    <Step>
    
              <div>
                <div className="flex flex-col mb-2">
                <div>
                {linkItems.map((item, index) => (
                  
                  
                  <div key={index} className="flex flex-row h-6 mb-1">
                    

                    
                    {item.type === 'link' && (
                      <div className="flex flex-row gap-x-0.5">
                      <input
                        required
                        type="text"
                        placeholder="제목"
                        className="w-[4rem]"
                        value={item.title}
                        onChange={(e) => {
                          const newItems = [...linkItems];
                          newItems[index].title = e.target.value;
                          setLinkItems(newItems);
                        }}
                      />
                      <input
                          required
                          type="text"
                          placeholder="링크"
                          className="w-[4rem] h-6"
                          value={item.link}
                          onChange={(e) => {
                            const newItems = [...linkItems];
                            newItems[index].link = e.target.value;
                            setLinkItems(newItems);
                          }} />
                      <div className="">
                        <button
                        className="px-1 inlisne-flex items-center mr-0.5 text-sm font-medium rounded-md border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"
                        onClick={onOpen}>
                        {selectedIcon ? <i className={`${selectedIcon}`} /> : <i className="ri-information-2-line" />}
                        </button>
                        <Modal size="xs" isOpen={isOpen} onOpenChange={onOpenChange}>
                          <ModalContent>
                            {(onClose) => (
                              <>
                                <ModalHeader className="flex flex-col gap-1">아이콘 선택</ModalHeader>
                                <ModalBody className="px-8">
                                  <div className="grid grid-cols-5 gap-3 justify-items-center">
                                    {/* 아이콘 샘플들 */}
                                    <Button className=""
                                    isIconOnly
                                    onPress={(e) => {const newItems = [...linkItems];
                                      newItems[index].icon ='ri-google-fill';
                                      setLinkItems(newItems);
                                      handleIconSelect('ri-google-fill');}}>
                                      <i className="ri-google-fill"></i>
                                    </Button>
                                    <Button className=""
                                    isIconOnly
                                    onPress={(e) => {const newItems = [...linkItems];
                                      newItems[index].icon ='ri-instagram-fill';
                                      setLinkItems(newItems);
                                      handleIconSelect('ri-instagram-fill');}}>
                                      <i className="ri-instagram-fill"></i>
                                    </Button>
                                    {/* 필요한 만큼 아이콘 추가 */}
                                    <Button className=""
                                    isIconOnly
                                    onPress={(e) => {const newItems = [...linkItems];
                                      newItems[index].icon ='ri-facebook-fill';
                                      setLinkItems(newItems);
                                      handleIconSelect('ri-facebook-fill');}}>
                                      <i className="ri-facebook-fill"></i>
                                    </Button>
                                    <Button className=""
                                    isIconOnly
                                    onPress={(e) => {const newItems = [...linkItems];
                                      newItems[index].icon ='ri-messenger-fill';
                                      setLinkItems(newItems);
                                      handleIconSelect('ri-messenger-fill');}}>
                                      <i className="ri-messenger-fill"></i>
                                    </Button>
                                    <Button className=""
                                    isIconOnly
                                    onPress={(e) => {const newItems = [...linkItems];
                                      newItems[index].icon ='ri-youtube-fill';
                                      setLinkItems(newItems);
                                      handleIconSelect('ri-youtube-fill');}}>
                                      <i className="ri-youtube-fill"></i>
                                    </Button>
                                    <Button className=""
                                    isIconOnly
                                    onPress={(e) => {const newItems = [...linkItems];
                                      newItems[index].icon ='ri-github-fill';
                                      setLinkItems(newItems);
                                      handleIconSelect('ri-github-fill');}}>
                                      <i className="ri-github-fill"></i>
                                    </Button>
                                    <Button className=""
                                    isIconOnly
                                    onPress={(e) => {const newItems = [...linkItems];
                                      newItems[index].icon ='ri-linkedin-box-fill';
                                      setLinkItems(newItems);
                                      handleIconSelect('ri-linkedin-box-fill');}}>
                                      <i className="ri-linkedin-box-fill"></i>
                                    </Button>
                                    <Button className=""
                                    isIconOnly
                                    onPress={(e) => {const newItems = [...linkItems];
                                      newItems[index].icon ='ri-medium-fill';
                                      setLinkItems(newItems);
                                      handleIconSelect('ri-medium-fill');}}>
                                      <i className="ri-medium-fill"></i>
                                    </Button>
                                    <Button className=""
                                    isIconOnly
                                    onPress={(e) => {const newItems = [...linkItems];
                                      newItems[index].icon ='ri-notion-fill';
                                      setLinkItems(newItems);
                                      handleIconSelect('ri-notion-fill');}}>
                                      <i className="ri-notion-fill"></i>
                                    </Button>
                                    <Button className=""
                                    isIconOnly
                                    onPress={(e) => {const newItems = [...linkItems];
                                      newItems[index].icon ='ri-slack-fill';
                                      setLinkItems(newItems);
                                      handleIconSelect('ri-slack-fill');}}>
                                      <i className="ri-slack-fill"></i>
                                    </Button>
                                    <Button className=""
                                    isIconOnly
                                    onPress={(e) => {const newItems = [...linkItems];
                                      newItems[index].icon ='ri-soundcloud-fill';
                                      setLinkItems(newItems);
                                      handleIconSelect('ri-soundcloud-fill');}}>
                                      <i className="ri-soundcloud-fill"></i>
                                    </Button>
                                    <Button className=""
                                    isIconOnly
                                    onPress={(e) => {const newItems = [...linkItems];
                                      newItems[index].icon ='ri-spotify-fill';
                                      setLinkItems(newItems);
                                      handleIconSelect('ri-spotify-fill');}}>
                                      <i className="ri-spotify-fill"></i>
                                    </Button>
                                    <Button className=""
                                    isIconOnly
                                    onPress={(e) => {const newItems = [...linkItems];
                                      newItems[index].icon ='ri-apple-fill';
                                      setLinkItems(newItems);
                                      handleIconSelect('ri-apple-fill');}}>
                                      <i className="ri-apple-fill"></i>
                                    </Button>
                                    <Button className=""
                                    isIconOnly
                                    onPress={(e) => {const newItems = [...linkItems];
                                      newItems[index].icon ='ri-telegram-fill';
                                      setLinkItems(newItems);
                                      handleIconSelect('ri-telegram-fill');}}>
                                      <i className="ri-telegram-fill"></i>
                                    </Button>
                                    <Button className=""
                                    isIconOnly
                                    onPress={(e) => {const newItems = [...linkItems];
                                      newItems[index].icon ='ri-twitch-fill';
                                      setLinkItems(newItems);
                                      handleIconSelect('ri-twitch-fill');}}>
                                      <i className="ri-twitch-fill"></i>
                                    </Button>
                                    <Button className=""
                                    isIconOnly
                                    onPress={(e) => {const newItems = [...linkItems];
                                      newItems[index].icon ='ri-twitter-fill';
                                      setLinkItems(newItems);
                                      handleIconSelect('ri-twitter-fill');}}>
                                      <i className="ri-twitter-fill"></i>
                                    </Button>
                                    <Button className=""
                                    isIconOnly
                                    onPress={(e) => {const newItems = [...linkItems];
                                      newItems[index].icon ='ri-twitter-x-fill';
                                      setLinkItems(newItems);
                                      handleIconSelect('ri-twitter-x-fill');}}>
                                      <i className="ri-twitter-x-fill"></i>
                                    </Button>
                                    <Button className=""
                                    isIconOnly
                                    onPress={(e) => {const newItems = [...linkItems];
                                      newItems[index].icon ='ri-vimeo-fill';
                                      setLinkItems(newItems);
                                      handleIconSelect('ri-vimeo-fill');}}>
                                      <i className="ri-vimeo-fill"></i>
                                    </Button>
                                    <Button className=""
                                    isIconOnly
                                    onPress={(e) => {const newItems = [...linkItems];
                                      newItems[index].icon ='ri-behance-fill';
                                      setLinkItems(newItems);
                                      handleIconSelect('ri-behance-fill');}}>
                                      <i className="ri-behance-fill"></i>
                                    </Button>
                                    <Button className=""
                                    isIconOnly
                                    onPress={(e) => {const newItems = [...linkItems];
                                      newItems[index].icon ='ri-blogger-fill';
                                      setLinkItems(newItems);
                                      handleIconSelect('ri-blogger-fill');}}>
                                      <i className="ri-blogger-fill"></i>
                                    </Button>
                                  </div>
                                </ModalBody>
                                <ModalFooter>
                                  <Button
                                  size="sm"
                                  color="danger"
                                  variant="light"
                                  onPress={onClose}>
                                    닫기
                                  </Button>
                                </ModalFooter>
                              </>
                            )}
                          </ModalContent>
                        </Modal>
                        {/* <input
                          type="text"
                          placeholder="아이콘"
                          className="w-[4rem]"
                          value={item.icon}
                          onChange={(e) => {
                            const newItems = [...linkItems];
                            newItems[index].icon = e.target.value;
                            setLinkItems(newItems);
                          }} /> */}
                          </div>
                        </div>
                      
                    )}
                    {item.type === 'description' && (
                      <div className="flex flex-row gap-x-0.5">

                        <input
                          type="text"
                          placeholder="제목"
                          className="w-[4rem]"
                          value={item.title}
                          onChange={(e) => {
                            const newItems = [...linkItems];
                            newItems[index].title = e.target.value;
                            setLinkItems(newItems);
                          }}
                        />
                        <input
                          type="text"
                          placeholder="설명"
                          className="w-[4rem] mr-[1.8rem]"
                          value={item.content}
                          onChange={(e) => {
                            const newItems = [...linkItems];
                            newItems[index].content = e.target.value;
                            setLinkItems(newItems);
                          }}
                        />
                      </div>
                    )}

                    <input
                      readOnly
                      type="text"
                      placeholder="타입"
                      className="w-[2rem]"
                      value={item.type === 'link' ? '링크' : item.type === 'description' ? '문장' : item.type}
                      onChange={(e) => {
                        const newItems = [...linkItems];
                        newItems[index].type = e.target.value;
                        setLinkItems(newItems);
                      }}
                    />
                    <button 
                    className="ml-1 px-2 inlisne-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-red-100 text-red-800 hover:bg-red-200 focus:outline-none focus:bg-red-200 disabled:opacity-50 disabled:pointer-events-none"
                    onClick={() => {
                      const newItems = linkItems.filter((_, i) => i !== index);
                      setLinkItems(newItems);
                    }}>삭제</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-x-1">
                <button
                className="block w-18 mb-1 px-2 py-1 bg-white text-black border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                onClick={() => handleAddLinkItem('link')}>링크 추가</button>
                <button
                className="block w-18 mb-1 px-2 py-1 bg-white text-black border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                onClick={() => handleAddLinkItem('description')}>설명 추가</button>
              </div>
          </div>
        
      
    </Step>
    <Step>
    <div>
                <input
                  type="text"
                  placeholder="주소"
                  value={contact.address}
                  onChange={(e) => setContact({ ...contact, address: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="생일"
                  value={contact.birthday}
                  onChange={(e) => setContact({ ...contact, birthday: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="회사"
                  value={contact.company}
                  onChange={(e) => setContact({ ...contact, company: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="이메일(집)"
                  value={contact.email.home}
                  onChange={(e) => setContact({ ...contact, email: { ...contact.email, home: e.target.value } })}
                />
                <input
                  type="text"
                  placeholder="이메일(직장)"
                  value={contact.email.work}
                  onChange={(e) => setContact({ ...contact, email: { ...contact.email, work: e.target.value } })}
                />
                <input
                  type="text"
                  placeholder="이름"
                  value={contact.fn}
                  onChange={(e) => setContact({ ...contact, fn: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="직책"
                  value={contact.position}
                  onChange={(e) => setContact({ ...contact, position: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="전화번호"
                  value={contact.tel}
                  onChange={(e) => setContact({ ...contact, tel: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="URL"
                  value={contact.url}
                  onChange={(e) => setContact({ ...contact, url: e.target.value })}
                />
              </div>
    </Step>
  </Stepper>

    </div>
  );
};
