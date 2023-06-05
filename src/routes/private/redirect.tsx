import React, { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";

export const Redirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    user?.type === 3
      ? navigate("/consult/consult_merchant/merchant_bank_statement")
      : navigate("/consult/deposit/generated_deposits");
  }, []);
  
  return (
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
};
