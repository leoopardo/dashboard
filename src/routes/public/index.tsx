/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Login } from "./Pages/SignIn";

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
