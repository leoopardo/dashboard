/* eslint-disable react-hooks/exhaustive-deps */
import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./Pages/SignIn";
import { ForgotMyPassword } from "./Pages/forgotMyPassword";

export const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="*" element={<Navigate to={"login"} />} />
      <Route path="login" element={<Login />} />
      <Route path="forgot_my_password" element={<ForgotMyPassword />} />
    </Routes>
  );
};
