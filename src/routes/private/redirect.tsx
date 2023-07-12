/* eslint-disable react-hooks/exhaustive-deps */
import { queryClient } from "@src/services/queryClient";
import { useValidate } from "@src/services/siginIn/validate";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Spin } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Redirect = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const { responseValidate } = useValidate();
  const navigate = useNavigate();

  useEffect(() => {
    permissions.report.paybrokers.balance.report_paybrokers_balance_list
      ? navigate("/consult/consult_organization/organization_balance")
      : permissions.report.paybrokers.extract.report_paybrokers_extract_list
      ? navigate("/consult/consult_organization/organization_bank_statement")
      : responseValidate?.type === 3
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
