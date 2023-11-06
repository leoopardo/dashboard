/* eslint-disable react-hooks/exhaustive-deps */
import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./Pages/SignIn";
import { ForgotMyPassword } from "./Pages/forgotMyPassword";
import { useEffect, useState } from "react";
import { queryClient } from "@src/services/queryClient";

export const PublicRoutes = () => {
  const [hasClear, setHasClear] = useState(false)
  useEffect(() => {
    if(hasClear){
      queryClient.clear();
      setHasClear(true)
    }
  }, []);
  return (
    <Routes>
      <Route path="*" element={<Navigate to={"login"} />} />
      <Route path="login" element={<Login />} />
      <Route path="forgot_my_password" element={<ForgotMyPassword />} />
    </Routes>
  );
};
