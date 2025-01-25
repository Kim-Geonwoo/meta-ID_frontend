import React, { useState } from 'react';
import { auth } from './lib/firebaseClient';
import { encrypt } from './lib/crypto';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';


import Login from '../components/Login';
import Signup from '../components/Signup';
import { Switch } from '@heroui/react';

import { HoverCard } from '../components/HoverCard';

const Home = () => {

  

  const [isLogin, setIsLogin] = useState(true);
  const [isSelected, setIsSelected] = React.useState(true);


  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const user = auth.currentUser;


  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();


  const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/'); // 로그인 후, 새로고침.
      } catch (error: any) {
        alert(error.message);
      }
    };


  const handleCreateServices = async () => {
    if (loading) return; // 이미 요청 중이면 중복 클릭 방지
    setLoading(true);


    try {
      const user = auth.currentUser;

      if (!user) {
        alert('먼저 로그인이 필요합니다.');
        setLoading(false);
        return;
      }

      const encryptedUserId = encrypt(user.uid);
      const response = await fetch('/api/createservices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: encryptedUserId, name, description }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setName(''); // name 초기화
        setDescription(''); // description 초기화
      } else {
        setMessage(`서버에러: ${data.message}`);
      }
    } catch (error: any) {
      setMessage(`서비스 생성중 에러: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const LoginIcon = (props) => {
    return (
      <svg
        aria-hidden="true"
        focusable="false"
        height="1em"
        role="presentation"
        viewBox="0 0 24 24"
        width="1em"
        {...props}
      >
        <g fill="blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M14 14.252V22H4C4 17.5817 7.58172 14 12 14C12.6906 14 13.3608 14.0875 14 14.252ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM18 17V14H20V17H23V19H20V22H18V19H15V17H18Z"></path></svg>
        </g>
      </svg>
    );
  };

  const SignupIcon = (props) => {
    return (
      <svg
        aria-hidden="true"
        focusable="false"
        height="1em"
        role="presentation"
        viewBox="0 0 24 24"
        width="1em"
        {...props}
      >
        <g fill="green-500">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10 11H4V3C4 2.44772 4.44772 2 5 2H19C19.5523 2 20 2.44772 20 3V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V13H10V16L15 12L10 8V11Z"></path></svg>
        </g>
      </svg>
    );
  };


  return (
    <div className="flex flex-col items-center pb-3 h-[calc(100vh-6.5rem)] bg-gray-300">
      <h1 className="font-medium text-4xl text-center mt-12">간단하게 만드는</h1>
      <h1 className="font-medium text-4xl text-center">나만의 디지털 명함</h1>
      <hr className="w-[18rem] border-black mt-1"></hr>
      <div className="mt-[3rem]">
        <button type="button" className="focus:outline-none disabled:opacity-50 disabled:pointer-events-none" aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-slide-up-animation-modal" data-hs-overlay="#hs-slide-up-animation-modal">
          <i className="ri-id-card-line ri-3x">
            
          </i>
        </button>
      </div>
      
      <div className="text-center mt-2">
        <i className="ri-arrow-up-long-line ri-2x"></i>
        <p className="font-light text-xl">아이콘을 클릭하면, <strong>내명함의<br />샘플을</strong> 확인할 수 있어요!</p>
      </div>
      
      
      {/* 샘플 3D 명함 모달내용 */}
      <div id="hs-slide-up-animation-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none" role="dialog" aria-labelledby="hs-slide-up-animation-modal-label">

        <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-14 opacity-0 ease-out transition-all duration-300 pointer-events-none justify-center items-center flex">
          <div className="flex flex-col w-96 bg-white border shadow-sm rounded-xl pointer-events-auto">
            <h3 className="text-lg font-semibold py-3 px-4 border-b">
            미리보는 <strong>{user ? user.displayName : '게스트'}</strong>님의 디지털 명함
            </h3>
            <div>
              <div className="my-6 flex justify-center items-center">
                <HoverCard />
              </div>
            </div>
            <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t">
              <button type="button" className="hs-dropup-toggle py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none" data-hs-overlay="#hs-slide-up-animation-modal">
                미리보기 닫기
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-[16rem] h-48 mt-[10rem]">
        {user ? 
          <div className="flex flex-col w-[16rem] h-48 items-center">
            {/* 이제 하단에 Stepper형식의 서비스 생성코드 추가필요. */}
            <h1 className="mt-6 text-2xl font-semibold">서비스 생성</h1>
            <input
            type="text"
            placeholder="서비스 이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <br />
            <textarea
              placeholder="서비스 설명"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button onClick={handleCreateServices} disabled={loading}>
              {loading ? '생성 중...' : '생성'}
            </button>
            {message && <p>{message}</p>}
            <br />
        </div>
      :        
        <div className="mb-6">
          <div className="flex flex-col items-center gap-2">
            <div className="text-2xl font-bold">[먼저 로그인이 필요해요!]</div>
            <Switch
              defaultSelected
              size="md"
              onValueChange={setIsSelected}
              startContent={<SignupIcon />}
              endContent={<LoginIcon />} 
              isSelected={isSelected} >
            </Switch>
            <div className="text-xl font-semibold mt-3">{isSelected ? '로그인' : '회원가입'}</div>
            <div className="text-small text-default-500">{isSelected ? <Login /> : <Signup />}</div>
          </div>
        </div>
      }
    </div>
      {/* <p>(개발전용) User UID: {user ? user.uid : '로그인필요.'}</p> 
      <p>(개발전용) Encrypted User UID: {user ? encrypt(user.uid) : '로그인필요'}</p> */}

      

      
    </div>
  );
};

export default Home;