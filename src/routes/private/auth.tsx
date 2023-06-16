import { Spin } from "antd";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Outlet, useLocation } from "react-router-dom";

export const Auth = () => {
  const [element, setElement] = useState<any>(
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spin tip="Loading" size="large">
        <div className="content" />
      </Spin>
    </div>
  );
  const location = useLocation();
  const { signOut, signInByStorage } = useAuth();
  useEffect(() => {
    async function signInStorage() {
      let success = false;
      success = await signInByStorage();

      if (!success) {
        signOut();
      }

      setElement(<Outlet />);
    }
    signInStorage();
  }, [location]);
  return element;
};
