import React from 'react';
import Link from 'next/link';

export default function About() {

  return (
    <div>
      <h1>환영합니다 사용자님 아이디탭 입니다.</h1>
      <div>
        <Link href="https://github.com/Kim-Geonwoo/meta-ID_frontend">
          <p>레포 보러가기</p>
        </Link>
      </div>
    </div>
  );
}