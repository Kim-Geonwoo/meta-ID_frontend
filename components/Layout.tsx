import React from 'react';
import Header from './Header';
import PageBar from './PageBar';
import PrelineScript from "./PrelineScript";
import AppBar from "./AppBar";

const Layout = ({ children }) => (
  <div className={`flex flex-col`}>
    <PrelineScript />
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

export default Layout;