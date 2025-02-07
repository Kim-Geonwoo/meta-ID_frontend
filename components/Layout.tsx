import React from 'react';
import Header from './Header';
import PageBar from './PageBar';
import AppBar from "./AppBar";
import { useRouter } from 'next/router';

const Layout = ({ children }) => {
  const router = useRouter();
  const isHelloAppsPage = router.pathname === '/helloapp';
  
  {/* helloapp 페이지일 경우, 페이지바 제거 및 레이아웃 크기조절 */}
  if (isHelloAppsPage) {
    return (
      <div className={`relative flex flex-col h-screen bg-black`}>
        <AppBar />
        <main className="container mx-auto max-w-7xl pt-6 px-6 flex-grow overflow-y-auto">
          {children}
        </main>
      </div>
    );
  }


  return (
    <div className={`flex flex-col`}>
      
      {/* 상단 메뉴바 (미사용) */}
      {/* <Header /> */}

      {/* 메인 body의 최대 높이지정 */}
      {/* 헤더사용시 + 전체화면 앱전용 <main className="w-full max-h-[calc(100vh-6.5rem)] overflow-y-auto"> */}
      {/* 헤더미사용시 + 전체화면 앱전용 <main className="w-full max-h-[calc(100vh-2.5rem)] overflow-y-auto"> */}
      {/* 헤더미사용시 + 웹앱전용 <main className="w-full max-h-[calc(100vh-10rem)] overflow-y-auto"> */}
      
      <main className="w-full max-h-[calc(100vh-10rem)] overflow-y-auto">
        {children}
      </main>
      
      {/* 하단 메뉴바 */}
      <PageBar />
    </div>
  );
};

export default Layout;