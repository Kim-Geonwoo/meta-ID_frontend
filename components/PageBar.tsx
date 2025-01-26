import React from 'react';
import Link from 'next/link';

const PageBar = () => {
  return (
    <nav className="bg-black h-14 place-content-center">
      <ul className="flex justify-center">
        <li className="flex flex-col items-center pr-7">
          <Link href="/sharemyid">
            <div className="flex flex-col items-center">
              <i className="ri-send-plane-fill text-white ri-lg"></i>
              <p className="text-xs text-white">공유하기</p>
            </div>
          </Link>
        </li>
        <li className="flex flex-col items-center pr-7">
          <Link href="/myid">
            <div className="flex flex-col items-center">
              <i className="ri-id-card-fill text-white ri-lg"></i>
              <p className="text-xs text-white">나의 명함</p>
            </div>
          </Link>
        </li>
        <li className="flex flex-col items-center pr-7">
          <Link href="/">
            <div className="flex flex-col items-center">
              <i className="ri-add-circle-fill text-white ri-lg"></i>
              <p className="text-xs text-white">명함 만들기</p>
            </div>
          </Link>
        </li>
        <li className="flex flex-col items-center pr-7">
          <Link href="/analytics">
            <div className="flex flex-col items-center">
              <i className="ri-bar-chart-box-fill text-white ri-lg"></i>
              <p className="text-xs text-white">명함통계</p>
            </div>
          </Link>
        </li>
        <li className="flex flex-col items-center">
          <Link href="/settings">
            <div className="flex flex-col items-center">
              <i className="ri-settings-5-fill text-white ri-lg"></i>
              <p className="text-xs text-white">앱 설정</p>
            </div>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default PageBar;
