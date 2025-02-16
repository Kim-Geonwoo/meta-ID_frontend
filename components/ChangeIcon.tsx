import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';

interface ChangeIconProps {
  selectedIcon: string;
  onIconSelect: (icon: string) => void;
}

const ChangeIcon: React.FC<ChangeIconProps> = ({ selectedIcon, onIconSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [linkItems, setLinkItems] = useState([{ icon: selectedIcon }]);
  const index = 0;

  const handleIconSelect = (icon: string) => {
    onIconSelect(icon);
    setIsOpen(false);
  };

  const onOpen = () => setIsOpen(true);
  const onOpenChange = () => setIsOpen(!isOpen);

  return (
    <div className="">
      <button
        className="px-2 py-1 inlisne-flex items-center mx-0.5 text-sm font-medium rounded-md border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"
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
                  {[
                    'ri-google-fill', 'ri-instagram-fill', 'ri-facebook-fill', 'ri-messenger-fill',
                    'ri-youtube-fill', 'ri-github-fill', 'ri-linkedin-box-fill', 'ri-medium-fill',
                    'ri-notion-fill', 'ri-slack-fill', 'ri-soundcloud-fill', 'ri-spotify-fill',
                    'ri-apple-fill', 'ri-telegram-fill', 'ri-twitch-fill', 'ri-twitter-fill',
                    'ri-twitter-x-fill', 'ri-vimeo-fill', 'ri-behance-fill', 'ri-blogger-fill'
                  ].map(icon => (
                    <Button
                      key={icon}
                      className=""
                      isIconOnly
                      onPress={() => {
                        const newItems = [...linkItems];
                        newItems[index].icon = icon;
                        setLinkItems(newItems);
                        handleIconSelect(icon);
                      }}>
                      <i className={icon}></i>
                    </Button>
                  ))}
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
    </div>
  );
};

export default ChangeIcon;