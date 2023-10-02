/* eslint-disable react-hooks/exhaustive-deps */
import { Spin } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Redirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard");
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
