import { Spin } from "antd";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const Auth = () => {
  const { t } = useTranslation();
  const [element, setElement] = useState<any>(
    <div
      style={{
        width: "80vw",
        height: "93vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spin tip={t("messages.loading")} size="large">
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
