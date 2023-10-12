import { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import Home from '../components/Home/Index';
import Layout from '../components/Layout/Index';
import Owners from '../components/Owners/Index';
import { setContext } from "@apollo/client/link/context";
import './App.scss'
import DolphinOwners from '../components/DolphinOwner/Index';
import LoginPage from '../components/Pages/Login/Index';
import UserSignup from '../components/Pages/Signup/Index';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";



const httpLink = createHttpLink({
  uri: "/graphql",
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("id_token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});


function App() {
  return (
    <ApolloProvider client={client}>
      <>
        <Routes>
          <Route path="/" activeclassname="active" element={<Layout />}>
            <Route index element={<Home />} />
            <Route
              path="/owners"
              activeclassname="active"
              element={<Owners />}
            />
            <Route
              path="/owners/godolphin"
              activeclassname="active"
              element={<DolphinOwners />}
            />
            <Route
              path="/login"
              activeclassname="active"
              element={<LoginPage />}
            />
            <Route
              path="/signup"
              activeclassname="active"
              element={<UserSignup />}
            />
          </Route>
        </Routes>
      </>
    </ApolloProvider>
  );
}

export default App;