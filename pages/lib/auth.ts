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

// useUser 훅을 사용하는 방법 예시
// import { useUser } from '../lib/auth';

// const MyComponent = () => {
//   const user = useUser(); // 현재 인증된 사용자 가져오기

//   useEffect(() => {
//     if (user) {
//       console.log('User is authenticated:', user);
//     } else {
//       console.log('User is not authenticated');
//     }
//   }, [user]);

//   return (
//     <div>
//       {user ? <p>Welcome, {user.displayName}</p> : <p>Please log in</p>}
//     </div>
//   );
// };