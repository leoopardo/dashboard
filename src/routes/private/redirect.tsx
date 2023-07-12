import { useValidate } from "@src/services/siginIn/validate";
import { Spin } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
