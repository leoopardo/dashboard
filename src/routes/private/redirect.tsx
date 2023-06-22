import React, { useEffect } from "react";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { useValidate } from "@src/services/siginIn/validate";

export const Redirect = () => {
  const { responseValidate } = useValidate();
  const navigate = useNavigate();

  useEffect(() => {
    responseValidate?.type === 3
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
