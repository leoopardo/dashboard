/* eslint-disable react-hooks/exhaustive-deps */
import { queryClient } from "@src/services/queryClient";
import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./Pages/SignIn";
import { ForgotMyPassword } from "./Pages/forgotMyPassword";
import { Banner } from "./Pages/banner";

export const PublicRoutes = () => {
  useEffect(() => {
    queryClient.invalidateQueries();
    console.log(queryClient.getQueryCache());
  }, []);

  return (
    <Routes>
      <Route path="*" element={<Navigate to={"login"} />} />
      <Route path="login" element={<Login />} />
      <Route path="forgot_my_password" element={<ForgotMyPassword />} />
      <Route path="banner" element={<Banner />} />
    </Routes>
  );
};
