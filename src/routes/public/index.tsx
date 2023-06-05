import React, { FC, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Login } from "./Pages/SignIn";
import { NotFount } from "./Pages/404";

interface PublicRoutesProps {
  route: string | undefined;
}

export const PublicRoutes: FC<PublicRoutesProps> = (props) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (props.route) {
      navigate(props.route);
    }
  }, []);

  return (
    <Routes>
      <Route path="login" element={<Login />} />
    </Routes>
  );
};
