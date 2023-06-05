import React, { FC, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Home } from "./Pages/home";
import { NotFount } from "../public/Pages/404";
import { Redirect } from "./redirect";
import { GeneratedDeposits } from "./Pages/consult/deposits/generated";

export const PrivateRoutes = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/login" element={<Redirect />} />
      <Route path="home" element={<Home />} />
      <Route path="*" element={<NotFount />} />


      <Route path="/" >
        <Route index element={<Redirect />} />
        <Route path="consult">
          <Route path="deposit">
            <Route path="generated_deposits" element={<GeneratedDeposits />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};
