import { useUser } from './lib/auth';

export default function Home() {
  const user = useUser();

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      {/* 추가적인 사용자 정보나 기능을 여기에 추가 */}
    </div>
  );
}