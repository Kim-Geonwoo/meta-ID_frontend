import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import { auth } from './lib/firebaseClient';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      await signOut(auth);
      router.push('/login');
    };
    logout();
  }, [router]);

  return <p>Logging out...</p>;
}