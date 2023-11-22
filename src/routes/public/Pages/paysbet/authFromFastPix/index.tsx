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
  Button,
  Col,
  Form,
  Input,
  Layout,
  Progress,
  Row,
  Spin,
  Typography,
} from "antd";
import { useEffect, useRef, useState } from "react";
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
    FastPixCredentialsMutate,
    FastPixCredentialsIsLoading,
    FastPixCredentialsError,
    FastPixCredentialsIsSuccess,
  } = useChangeFastPixCredentials({ body: changeCredentials });
  const { refetchValidate, isValidateFetching, isSuccess } =
    useValidateFastPix();
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [, setCantSubmit] = useState<boolean>(true);
  const submitRef = useRef<HTMLButtonElement>(null);

  const userData:
    | {
        id: string;
        document: string;
        name: string;
        username: string;
        pending_password_change: boolean;
        balance: number;
      }
    | undefined = queryClient.getQueryData("FastPixTokenValidate");

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
    if (tokenSuccess && !LoginError && !userData?.pending_password_change) {
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
    setChangeCredentials({ username: userData?.username });
  }, [userData, isSuccess]);

  const handleChangeCredentials = (event: any) => {
    setChangeCredentials((state: any) => ({
      ...state,
      [event.target.name]: event.target.value,
    }));
  };

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
        ) : tokenSuccess && !LoginError && userData?.pending_password_change ? (
          <Row>
            <Col
              span={24}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Typography.Title
                level={1}
                style={{ color: defaultTheme.colors.secondary }}
              >
                {t("paysbet.welcome")}: {userData?.name}
              </Typography.Title>
            </Col>
            <Col
              span={24}
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 40,
              }}
            >
              <Typography.Title
                level={3}
                style={{ color: defaultTheme.colors.info }}
              >
                {t("paysbet.first_access")}
              </Typography.Title>
            </Col>

            <Form
              style={{ width: "100%" }}
              layout="vertical"
              onFinish={FastPixCredentialsMutate}
            >
              <Row
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
                gutter={8}
                align="top"
              >
                <Row
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    marginTop: -8,
                  }}
                  gutter={8}
                  align="top"
                >
                  <Col xs={{ span: 24 }} md={{ span: 8 }}>
                    <Form.Item label={t("login.user")}>
                      <Input
                        size="large"
                        onChange={handleChangeCredentials}
                        value={changeCredentials.username}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    marginTop: -8,
                  }}
                  gutter={8}
                  align="top"
                >
                  <Col xs={{ span: 24 }} md={{ span: 8 }}>
                    <Form.Item
                      label={t(`table.password`)}
                      name="password"
                      dependencies={["confirmPasswprd"]}
                      hasFeedback
                      rules={[
                        {
                          required: true,
                          message:
                            t("input.required(a)", {
                              field: t("input.password"),
                            }) || "",
                        },
                        {
                          pattern:
                            /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]*$/,
                          message: `${t("input.password_type")}`,
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (
                              !value ||
                              getFieldValue("confirmPasswprd") === value
                            ) {
                              setCantSubmit(false);
                              return Promise.resolve();
                            }
                            setCantSubmit(true);
                            return Promise.reject(
                              new Error(t("input.doest_match") || "")
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password
                        type="password"
                        size="large"
                        name="password"
                        autoComplete="new-password"
                        value={changeCredentials.password}
                        onChange={handleChangeCredentials}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    marginTop: -8,
                  }}
                  gutter={8}
                  align="top"
                >
                  <Col xs={{ span: 24 }} md={{ span: 8 }}>
                    <Form.Item
                      label={t(`table.confirm_password`)}
                      name="confirmPasswprd"
                      dependencies={["password"]}
                      rules={[
                        {
                          required: true,
                          message: t("input.confirm_password") || "",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                              setCantSubmit(false);
                              return Promise.resolve();
                            }
                            setCantSubmit(true);
                            return Promise.reject(
                              new Error(t("input.doest_match") || "")
                            );
                          },
                        }),
                      ]}
                      hasFeedback
                    >
                      <Input.Password
                        type="password"
                        size="large"
                        name="confirmPasswprd"
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Col xs={{ span: 24 }} md={{ span: 8 }}>
                  <Button
                    type="primary"
                    size="large"
                    style={{ width: "100%" }}
                    loading={FastPixCredentialsIsLoading}
                    onClick={() => submitRef.current?.click()}
                  >
                    {t("paysbet.update")}
                  </Button>
                </Col>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <button
                    type="submit"
                    ref={submitRef}
                    style={{ display: "none" }}
                  >
                    Submit
                  </button>
                </Form.Item>
              </Row>
            </Form>
          </Row>
        ) : tokenSuccess &&
          !LoginError &&
          !userData?.pending_password_change ? (
          <Row>
            <Col span={24} style={{}}>
              <Typography.Title
                level={1}
                style={{ color: defaultTheme.colors.secondary }}
              >
                {t("paysbet.welcome")}: {userData?.name}
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
        actionError="update"
        actionSuccess="updated"
      />
    </Layout>
  );
};
