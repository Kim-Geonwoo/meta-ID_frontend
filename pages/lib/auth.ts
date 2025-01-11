// 유저정보를 쉽게 가져오기 위한, 코드파일
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseClient';

export const useUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return user;
};


// 사용법 예시
/* useUser 훅을 사용하는 방법 예시
import { useUser } from '../lib/auth';

const MyComponent = () => {
  const user = useUser(); // 현재 인증된 사용자 가져오기

  useEffect(() => {
    if (user) {
      console.log('로그인이 이미 되어있습니다:', user);
    } else {
      console.log('로그인이 되지 않았습니다.');
    }
  }, [user]);

  return (
    <div>
      {user ? <p>환영합니다, {user.displayName} 님</p> : <p>먼저 로그인을 해주세요.</p>} // 로그인이 되어있으면, 사용자 이름을 보여줍니다.
    </div>
  );
}; */