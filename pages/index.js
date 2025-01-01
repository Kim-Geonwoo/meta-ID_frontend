import { useQuery } from '@apollo/client';
import { GET_USERS } from './graphql/queries';

export default function Home() {
  const { loading, error, data } = useQuery(GET_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1 style={{ color: '#333' }}>Users</h1>
      <ul>
        {data.users.map((user) => (
          <li key={user.id}>
            {user.username} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}