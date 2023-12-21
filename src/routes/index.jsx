import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom"
import { Chat } from "../pages/Chat";
import { SingleChat } from "../pages/SingleChat";

export function RoutesApp() {
    return (
      <BrowserRouter>
        <Routes>
          <Route Component={Chat} path="/"/>
          <Route Component={SingleChat} path="/singlechat/:nome"/>
        </Routes>            
     </BrowserRouter>
    )
}