import ApolloClient from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import AsyncStorage from '@react-native-community/async-storage';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';

const httpLink = createHttpLink({
  uri: 'http://18.191.134.82:30306',
  // uri: 'http://localhost:4000',
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${`JSON.stringify(locations)`}, Path: ${path}`,
      ),
    );
  }

  if (networkError) console.error(`[Network error]: ${networkError}`);
});

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  try {
    const token = await AsyncStorage.getItem('token');
    console.log('token: ', token)
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    }
  } catch (err) {
    console.log("Error in set context")
    return {
      headers: {
        ...headers,
      }
    }
  }
});

const link = ApolloLink.from([
  authLink,
  httpLink,
  errorLink,
]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

export default client;