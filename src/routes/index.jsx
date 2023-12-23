import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom"
import { Chat } from "../pages/Chat";
import { SingleChat } from "../pages/SingleChat";
import { Login } from "../pages/Login";
import { CreateAccount } from "../pages/CreateAccount";

export function RoutesApp() {
    return (
      <BrowserRouter>
        <Routes>
          <Route Component={Chat} path="/chat"/>
          <Route Component={Login} path="/"/>
          <Route Component={CreateAccount} path="/createAccount"/>
          <Route Component={SingleChat} path="/singlechat/:nome"/>
        </Routes>            
     </BrowserRouter>
    )
}