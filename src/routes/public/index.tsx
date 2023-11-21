/* eslint-disable react-hooks/exhaustive-deps */
import { queryClient } from "@src/services/queryClient";
import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./Pages/SignIn";
import { ForgotMyPassword } from "./Pages/forgotMyPassword";
import { Banner } from "./Pages/banner";
import { Paysbet } from "./Pages/paysbet";

export const PublicRoutes = () => {
  useEffect(() => {
    queryClient.invalidateQueries();
  }, []);

  return (
    <Routes>
      <Route path="*" element={<Navigate to={"login"} />} />
      <Route path="login" element={<Login />} />
      <Route path="forgot_my_password" element={<ForgotMyPassword />} />
      <Route path="banner/:number" element={<Banner />} />
      <Route path="paysbet" element={<Paysbet />} />
    </Routes>
  );
};
