import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

const CREATE_USER = gql`
  mutation CreateUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      id
      username
      email
    }
  }
`;

export default function CreateUser() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [createUser, { data, loading, error }] = useMutation(CREATE_USER);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createUser({ variables: { username, email, password } });
    setUsername('');
    setEmail('');
    setPassword('');
  };

  return (
    <div>
      <h1 style={{ color: '#333' }}>Create User</h1>
      <form onSubmit={handleSubmit} style={{ margin: '20px 0' }}>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ marginRight: '10px' }}
          />
        </label>
        <br />
        <label style={{ display: 'block', marginBottom: '10px' }}>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginRight: '10px' }}
          />
        </label>
        <br />
        <label style={{ display: 'block', marginBottom: '10px' }}>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginRight: '10px' }}
          />
        </label>
        <br />
        <button type="submit" style={{ backgroundColor: '#0070f3', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }}>
          Create User
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <p>User created successfully!</p>}
    </div>
  );
}