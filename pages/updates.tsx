import React from 'react';
import Link from 'next/link';

export default function Updates() {

  return (
    <div>
      <h1>환영합니다 사용자님 아이디탭 입니다.</h1>
      <p>이곳은 아이디탭의 업데이트 및 개선내용이 올라오는 페이지입니다.</p>
      <div>
        <Link href="https://github.com/Kim-Geonwoo/meta-ID_frontend">
          <p>개발자 레포 보러가기</p>
        </Link>
      </div>
    </div>
  );
}