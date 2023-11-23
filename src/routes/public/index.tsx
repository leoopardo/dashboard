/* eslint-disable react-hooks/exhaustive-deps */
import { queryClient } from "@src/services/queryClient";
import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./Pages/SignIn";
import { ForgotMyPassword } from "./Pages/forgotMyPassword";
import { Banner } from "./Pages/banner";
import { Paysbet } from "./Pages/paysbet";
import { Typography } from "antd";
import { AuthFromFastPix } from "./Pages/paysbet/authFromFastPix";
import { Profile } from "./Pages/paysbet/profile";

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
      <Route path="paysbet" element={<Paysbet />}>
        <Route path={"aviator"} element={<Typography>Aviãozinho</Typography>} />
        <Route path={"cassino"} element={<Typography>Cassino</Typography>} />
        <Route
          path={"roulette"}
          element={<Typography>Roleta ao vivo</Typography>}
        />
        <Route path={"car"} element={<Typography>Carrinho</Typography>} />
        <Route path={"profile"} element={<Profile />} />
        <Route path={"auth"} element={<AuthFromFastPix />} />
      </Route>
    </Routes>
  );
};
