import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4000/graphql';

const client = new ApolloClient({
  link: createHttpLink({ uri: GRAPHQL_URL }),
  cache: new InMemoryCache(),
});

export default client;
