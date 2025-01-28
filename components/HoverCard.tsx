"use client";

import Image from "next/image";
import React from "react";
import { CardBody, CardContainer, CardItem } from "./CardItem";
import { useUser } from '../pages/lib/auth';

export function HoverCard() {
  const user = useUser(); // 현재 인증된 사용자 가져오기

  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 group/card border-black/[0.1] w-[19.5rem] h-auto rounded-xl p-6 border">
        {/* 최상위 CardItem 컴포넌트 */}
        <CardItem
            translateZ="20"
            rotateX={-5}
            className="flex flex-col w-full mt-4 place-items-center"
            >
          {/* CardItem 컴포넌트 첫번째 - 프로필사진 */}
          <CardItem
            translateZ="25"
            className="text-xl font-bold text-neutral-600"
          >
            <Image
              src="https://img-sv.geonwoo.dev/meta-id_front/profile.webp"
              height="100"
              width="100"
              className="object-cover rounded-full border-4 group-hover/card:shadow-xl"
              alt="thumbnail"
            />
          </CardItem>
          {/* CardItem 컴포넌트 두번째 - 이름 */}
          <CardItem
            translateZ="30"
            className="text-2xl font-sans font-bold mt-4"
          >
              {user ? `${user.displayName}` : "게스트"}
          </CardItem>
          {/* CardItem 컴포넌트 세번째 - 유저상태 */}
          <CardItem
            translateZ="40"
            rotateX={-5}
            
            className="text-neutral-500 text-sm max-w-sm mt-1"
          >
            <div className="text-2xl font-sans font-medium  flex justify-center items-center">
              <span className="text-green-500 text-xs">●</span>
              <span id="contact-jobs" className="text-green-500 text-sm ml-1">메타ID 사용중</span>
            </div>
          </CardItem>

          {/* 링크 박스시작 */}
          <CardItem
            translateZ="40"
            rotateX={-5}
            
            className="text-neutral-500 text-sm max-w-sm mt-2"
          >
            <p className="text-center text-gray-600 mt-6 mb-2">링크 바로가기</p>
          </CardItem>
          
          
          <CardItem
            translateZ="40"
            rotateX={-5}
            
            className="text-neutral-500 text-sm max-w-sm mt-2"
          >
            <div className="card w-64 bg-gray-200 rounded-lg shadow-md p-2 flex items-center justify-center">
              <a href={`mailto:${user ? `${user.email}` : "kgw@geonwoo.dev"}`} className="flex items-center justify-center w-full text-gray-700" target="_blank" rel="noopener noreferrer">
                  <i className="ri-mail-fill ri-lg pr-2"></i>
                  {user ? `${user.displayName}의` : "개발자의"} 이메일
              </a>
            </div>
          </CardItem>

          <CardItem
            translateZ="40"
            rotateX={-5}
            
            className="text-neutral-500 text-sm max-w-sm mt-2"
          >
            <div className="card w-64 bg-gray-200 rounded-lg shadow-md p-2 flex items-center justify-center">
              <a href="https://www.instagram.com" className="flex items-center justify-center w-full text-gray-700" target="_blank" rel="noopener noreferrer">
                  <i className="ri-instagram-fill ri-lg pr-2"></i>
                  인스타그램
              </a>
            </div>
          </CardItem>

          <CardItem
            translateZ="40"
            rotateX={-5}
            
            className="text-neutral-500 text-sm max-w-sm mt-2"
          >
            <div className="card w-64 bg-gray-200 rounded-lg shadow-md p-2 flex items-center justify-center">
              <a href="https://www.kakaocorp.com/" className="flex items-center justify-center w-full text-gray-700" target="_blank" rel="noopener noreferrer">
                  <i className="ri-chat-3-fill ri-lg pr-2"></i>
                  카카오
              </a>
            </div>
          </CardItem>

          <CardItem
            translateZ="40"
            rotateX={-5}
            
            className="font-medium text-neutral-500 text-sm max-w-sm mt-2"
          >
            <div className="card flex flex-col w-64 bg-gray-200 rounded-lg shadow-md p-2 items-center justify-center">
              <p>안녕하세요! 저는 <strong>{user ? `${user.displayName}` : "게스트"}</strong> 입니다!</p>
              <p><strong>연락처에 추가하기</strong>를 누르시면</p>
              <p>연락처앱에 저를 저장하실 수 있어요!</p>
            </div>
          </CardItem>
          {/* 링크 박스 끄읏 */}
        
        
        </CardItem>

        {/* 연락처 추가하기 버튼 - (실제 작동 X) */}
        <div className="flex justify-center items-center">
        <CardItem
          translateZ="30"
          rotateX={-5}
          as="button"
          className="w-full inline-block mt-6 px-4 py-2 font-medium text-white bg-blue-500 rounded hover:bg-blue-600 text-center"
        >
          <i className="ri-user-add-fill pr-1.5"></i>
          연락처에 추가하기
        </CardItem>


        </div>
      </CardBody>
    </CardContainer>
  );
}
