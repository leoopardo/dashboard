/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Toast } from "@src/components/Toast";
import { useTheme } from "@src/contexts/ThemeContext";
import { useChangeFastPixCredentials } from "@src/services/FASTPIX/siginIn/changeCredentials";
import { useFastPixToken } from "@src/services/FASTPIX/siginIn/signIn";
import { useValidateFastPix } from "@src/services/FASTPIX/siginIn/validate";
import { queryClient } from "@src/services/queryClient";
import { defaultTheme } from "@src/styles/defaultTheme";
import {
  Col,
  Layout,
  Progress,
  Row,
  Spin,
  Typography
} from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

const { Content } = Layout;

export const AuthFromFastPix = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const { t } = useTranslation();
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  const [changeCredentials, setChangeCredentials] = useState<{
    username?: string;
    password?: string;
  }>({});

  const { Login, tokenSuccess, tokenLoading, LoginError } = useFastPixToken(
    undefined,
    `${token}`
  );
  const {
    FastPixCredentialsError,
    FastPixCredentialsIsSuccess,
  } = useChangeFastPixCredentials({ body: changeCredentials });
  const { refetchValidate, isValidateFetching, isSuccess, responseValidate } =
    useValidateFastPix();

  useEffect(() => {
    Login();
  }, [token]);

  useEffect(() => {
    if (tokenSuccess) {
      queryClient.invalidateQueries();
      refetchValidate();
      console.log("logado");
    }
  }, [tokenSuccess]);

  useEffect(() => {
    if (tokenSuccess && !LoginError) {
      const interval = setInterval(() => {
        setCount((prevCount) => {
          const newCount = prevCount + 20;
          if (newCount >= 100) {
            clearInterval(interval);
            navigate("/paysbet");
            return 100;
          }
          return newCount;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
    setChangeCredentials({ username: responseValidate?.username });
  }, [responseValidate, isSuccess]);

  // const handleChangeCredentials = (event: any) => {
  //   setChangeCredentials((state: any) => ({
  //     ...state,
  //     [event.target.name]: event.target.value,
  //   }));
  // };

  return (
    <Layout
      style={{
        padding: "24px 24px",
        minHeight: "90vh",
      }}
    >
      <Content
        style={{
          padding: 24,
          margin: 0,
          height: "100%",
          background: theme === "dark" ? "#222222 " : "#fdfdfd",
        }}
      >
        {tokenLoading || isValidateFetching ? (
          <Row
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center ",
            }}
          >
            <Spin />
          </Row>
        ) : tokenSuccess && !LoginError ? (
          <Row>
            <Col span={24} style={{}}>
              <Typography.Title
                level={1}
                style={{ color: defaultTheme.colors.secondary }}
              >
                {t("paysbet.welcome")}: {responseValidate?.name}
              </Typography.Title>
              <Col span={24}>
                <Typography.Title
                  level={3}
                  style={{ color: defaultTheme.colors.info }}
                >
                  {t("paysbet.preparing")}
                </Typography.Title>
                <Progress size="default" percent={count} showInfo={false} />
              </Col>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col span={24} style={{}}>
              <Typography.Title
                level={1}
                style={{ color: defaultTheme.colors.secondary }}
              >
                {t("paysbet.invalid_token")}
              </Typography.Title>
            </Col>
          </Row>
        )}
      </Content>
      <Toast
        error={FastPixCredentialsError}
        success={FastPixCredentialsIsSuccess}
        actionError={t("messages.update")}
        actionSuccess={t("messages.updated")}
      />
    </Layout>
  );
};
