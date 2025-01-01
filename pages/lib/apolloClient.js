import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: '/graphql', // 프록시된 경로 사용
  cache: new InMemoryCache(),
});

export default client;