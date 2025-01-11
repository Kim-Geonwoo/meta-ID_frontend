// 파이어베이스 사용을 위한, Firebase Client 설정 파일.
import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// Firebase Auth 상태 지속성 설정
setPersistence(auth, browserSessionPersistence)
  .then(() => {
    console.log('파이어베이스 유저 지속성이 성공적으로 설정되었습니다.'); // 추후, 프로덕션시 제거필요.
  })
  .catch((error) => {
    console.error('파이어베이스 유저 지속성 세팅중, 오류발생.', error); // 추후, 프로덕션시 제거필요.
  });

const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };