// 에러페이지를 커스텀하기 위한 파일 

import React from 'react';

const Error = ({ statusCode }) => {
  return (
    // 에러페이지 화면의 최대 높이지정 및 기타정렬 코드
    <div className="flex flex-col items-center justify-center h-[calc(100vh-6.5rem)]">
      {statusCode === 404 ? (
        <div>
          <h1>404 - 페이지를 찾을 수 없습니다.</h1>
          <p>죄송합니다. 요청하신 페이지를 찾을 수 없습니다.</p>
        </div>
      ) : statusCode === 500 ? (
        <div>
          <h1>500 - 서버 오류</h1>
          <p>죄송합니다. 서버에서 오류가 발생했습니다.</p>
        </div>
      ) : statusCode === 501 ? (
        <div>
          <h1>501 - 구현되지 않은 기능</h1>
          <p>죄송합니다. 요청하신 기능이 구현되지 않았습니다.</p>
        </div>
      ) : statusCode === 502 ? (
        <div>
          <h1>502 - 잘못된 게이트웨이</h1>
          <p>죄송합니다. 잘못된 게이트웨이 오류가 발생했습니다.</p>
        </div>
      ) : statusCode === 503 ? (
        <div>
          <h1>503 - 서비스 이용 불가</h1>
          <p>죄송합니다. 현재 서비스 이용이 불가합니다.</p>
        </div>
      ) : statusCode === 504 ? (
        <div>
          <h1>504 - 게이트웨이 시간 초과</h1>
          <p>죄송합니다. 게이트웨이 시간 초과 오류가 발생했습니다.</p>
        </div>
      ) : statusCode === 400 ? (
        <div>
          <h1>400 - 잘못된 요청</h1>
          <p>죄송합니다. 잘못된 요청입니다.</p>
        </div>
      ) : statusCode === 401 ? (
        <div>
          <h1>401 - 권한 없음</h1>
          <p>죄송합니다. 권한이 없습니다.</p>
        </div>
      ) : statusCode === 405 ? (
        <div>
          <h1>405 - 허용되지 않는 메서드</h1>
          <p>죄송합니다. 허용되지 않는 메서드입니다.</p>
        </div>
      ) : statusCode === 408 ? (
        <div>
          <h1>408 - 요청 시간 초과</h1>
          <p>죄송합니다. 요청 시간 초과 오류가 발생했습니다.</p>
        </div>
      ) : (
        <div>
          <h1>{statusCode ? `오류 ${statusCode}` : '서버에서 오류가 발생했습니다.'}</h1>
          <p>죄송합니다. 문제가 발생했습니다.</p>
        </div>
      )}
    </div>
  );
};

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;