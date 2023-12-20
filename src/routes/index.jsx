import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom"
import { Chat } from "../pages/Chat";

export function RoutesApp() {
    return (
      <BrowserRouter>
        <Routes>
          <Route Component={Chat} path="/"/>
        </Routes>            
     </BrowserRouter>
    )
}