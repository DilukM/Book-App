import { ApolloClient, InMemoryCache, ApolloLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import UploadHttpLink from "apollo-upload-client/UploadHttpLink.mjs";

// Automatically select the correct GraphQL URL based on environment
const getGraphQLUrl = () => {
  return process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:3001/graphql";
};

const uploadLink = new UploadHttpLink({
  uri: getGraphQLUrl(),
  credentials: "include",
}) as unknown as ApolloLink;

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(uploadLink),
  cache: new InMemoryCache(),
});
