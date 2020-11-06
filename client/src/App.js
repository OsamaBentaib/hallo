import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";

import ApolloProvider from "./ApolloProvider";

import "./assets/css/App.scss";

import Signup from "./pages/Signup";
import Signin from "./pages/Signin";

import { AuthProvider } from "./context/auth";
import { MessageProvider } from "./context/message";
import DynamicRoute from "./util/DynamicRoute";
import Layout from "./pages/home/Layout";

function App() {
  return (
    <ApolloProvider>
      <AuthProvider>
        <MessageProvider>
          <BrowserRouter>
            <Switch>
              <DynamicRoute exact path="/" component={Layout} authenticated />
              <DynamicRoute path="/signup/" component={Signup} guest />
              <DynamicRoute path="/signin/" component={Signin} guest />
            </Switch>
          </BrowserRouter>
        </MessageProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
