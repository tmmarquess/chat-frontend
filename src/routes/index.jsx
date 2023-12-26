import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom"
// import { Chat } from "../pages/Chat";
import { SingleChat } from "../pages/SingleChat";
import { Login } from "../pages/Login";
import { CreateAccount } from "../pages/CreateAccount";

export function RoutesApp() {
    return (
      <BrowserRouter>
        <Routes>
        <Route Component={SingleChat} path="/chat"/>
          <Route Component={SingleChat} path="/chat/:chatEmail"/>
          <Route Component={Login} path="/"/>
          <Route Component={CreateAccount} path="/createAccount"/>
        </Routes>            
     </BrowserRouter>
    )
}