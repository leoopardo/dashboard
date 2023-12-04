/* eslint-disable react-hooks/exhaustive-deps */
import { SendOutlined } from "@ant-design/icons";
import ForgotPassword from "@assets/forgot.svg";
import { useTheme } from "@src/contexts/ThemeContext";
import { useForgotMyPassword } from "@src/services/siginIn/forgotMyPassword";
import { defaultTheme } from "@src/styles/defaultTheme";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  Button,
  Col,
  Form,
  Input,
  Layout,
  Progress,
  Radio,
  Row,
  Typography,
} from "antd";
import { Content, Footer } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

export const ForgotMyPassword = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: "750px" });
  const [username, setUsername] = useState<string>("");
  const [messageChannel, setMessageChannel] = useState<
    "EMAIL" | "SMS" | undefined
  >("SMS");
  const [count, setCount] = useState(0);
  const [confirmedChannel, setConfirmedChannel] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const {
    ForgotMyPasswordError,
    ForgotMyPasswordIsLoading,
    ForgotMyPasswordIsSuccess,
    ForgotMyPasswordMutate,
    data,
  } = useForgotMyPassword({ username, message_channel: messageChannel });

  const handleInterval = () => {
    if (ForgotMyPasswordIsSuccess) {
      setConfirmedChannel(data?.message_channel);
      const interval = setInterval(() => {
        setCount((prevCount) => {
          const newCount = prevCount + 10;
          if (newCount >= 100) {
            clearInterval(interval);
            setConfirmedChannel("");
            navigate("/login");
            return 100;
          }
          return newCount;
        });
      }, 1000);
  
      return () => {
        clearInterval(interval);
        setCount(0);
      };
    }
  }

  useEffect(() => {
    handleInterval()
  }, [ForgotMyPasswordIsSuccess]);

  useEffect(() => {
    if (ForgotMyPasswordError) {
      setError(true);
      const interval = setInterval(() => {
        setCount((prevCount) => {
          const newCount = prevCount + 10;
          if (newCount >= 100) {
            clearInterval(interval);
            setCount(0);
            setError(false);
            return 100;
          }
          return newCount;
        });
      }, 1000);
      return () => {
        clearInterval(interval);
        setCount(0);
        setError(false);
      };
    }
  }, [ForgotMyPasswordError]);

  return (
    <>
      <Layout className="layout" style={{ height: "100vh" }}>
        <Breadcrumb
          style={{ margin: "16px 64px", fontSize: isMobile ? 14 : 18 }}
        >
          <Breadcrumb.Item href="/">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <img
                src={import.meta.env.VITE_APP_ICON}
                style={{
                  width: 22,
                  marginRight: 8,
                }}
              />{" "}
              {import.meta.env.VITE_APP_COMPANY_NAME}
            </div>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Recuperar senha</Breadcrumb.Item>
        </Breadcrumb>
        <Row
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Col xs={{ span: 22 }} md={{ span: 22 }} style={{ height: "100%" }}>
            <Content
              style={{
                padding: 2,
                margin: 0,
                height: "100%",
                background: theme === "dark" ? "#222222 " : "#fdfdfd",
                width: "100%",
                borderRadius: 8,
              }}
            >
              {!confirmedChannel && !error ? (
                <Row style={{ marginTop: isMobile ? 8 : 64, width: "100%" }}>
                  <Col xs={{ span: 24 }} md={{ span: 3 }} />

                  {isMobile && (
                    <Col
                      xs={{ span: 24 }}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Typography.Title
                        level={2}
                        style={{
                          color:
                            theme === "dark"
                              ? undefined
                              : defaultTheme.colors.primary,
                        }}
                      >
                        Esqueceu sua senha?
                      </Typography.Title>
                    </Col>
                  )}
                  <Col xs={{ span: 24 }} md={{ span: 10 }}>
                    <img
                      src={ForgotPassword}
                      style={{
                        width: "70%",
                        marginLeft: isMobile ? 50 : 0,
                        marginTop: !isMobile ? "4vh" : 0,
                      }}
                    />
                  </Col>
                  <Col
                    xs={{ span: 22 }}
                    md={{ span: 8 }}
                    style={{
                      marginLeft: isMobile ? 0 : -40,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: isMobile ? "center" : undefined,
                      flexDirection: "column",
                    }}
                  >
                    {!isMobile && (
                      <Typography.Title
                        style={{
                          color:
                            theme === "dark"
                              ? undefined
                              : defaultTheme.colors.primary,
                        }}
                      >
                        Esqueceu sua senha?
                      </Typography.Title>
                    )}

                    <Typography.Title
                      level={isMobile ? 5 : 4}
                      style={{
                        color:
                          theme === "dark"
                            ? undefined
                            : defaultTheme.colors.secondary,
                        marginTop: 8,
                        textAlign: isMobile ? "center" : undefined,
                      }}
                    >
                      Digite seu usuário abaixo para verificarmos se sua conta
                      possui email ou telefone validado.
                    </Typography.Title>
                    <Form
                      layout="vertical"
                      style={{
                        marginTop: 16,
                        width: isMobile ? "90%" : "100%",
                      }}
                    >
                      <Form.Item label="Usuário">
                        <Input
                          style={{ width: "100%" }}
                          size="large"
                          placeholder="ExemploDeUsuário"
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </Form.Item>

                      <Form.Item>
                        <Button
                          loading={ForgotMyPasswordIsLoading}
                          onClick={() => ForgotMyPasswordMutate()}
                          size="large"
                          type="primary"
                          style={{ width: "100%" }}
                        >
                          <SendOutlined />
                        </Button>
                      </Form.Item>
                      <Form.Item label="Canal da mensagem">
                        <Radio.Group
                          onChange={(e) => setMessageChannel(e.target.value)}
                          value={messageChannel}
                        >
                          <Radio value={"EMAIL"}>Email</Radio>
                          <Radio value={"SMS"}>Telefone</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Form>
                  </Col>
                </Row>
              ) : confirmedChannel === "SMS" ? (
                <Row style={{ marginTop: isMobile ? 8 : 64, width: "100%" }}>
                  <Col xs={{ span: 24 }} md={{ span: 3 }} />

                  {isMobile && (
                    <Col
                      xs={{ span: 24 }}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Typography.Title
                        level={2}
                        style={{
                          color:
                            theme === "dark"
                              ? undefined
                              : defaultTheme.colors.primary,
                        }}
                      >
                        SMS enviado para {data?.phone}
                      </Typography.Title>
                    </Col>
                  )}
                  <Col xs={{ span: 24 }} md={{ span: 10 }}>
                    <img
                      src={ForgotPassword}
                      style={{
                        width: "70%",
                        marginLeft: isMobile ? 50 : 0,
                        marginTop: !isMobile ? "4vh" : 0,
                      }}
                    />
                  </Col>
                  <Col
                    xs={{ span: 22 }}
                    md={{ span: 8 }}
                    style={{
                      marginLeft: isMobile ? 0 : -40,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: isMobile ? "center" : undefined,
                      flexDirection: "column",
                    }}
                  >
                    {!isMobile && (
                      <Typography.Title
                        style={{
                          color:
                            theme === "dark"
                              ? undefined
                              : defaultTheme.colors.primary,
                        }}
                      >
                        SMS enviado para {data?.phone}
                      </Typography.Title>
                    )}

                    <Typography.Title
                      level={isMobile ? 5 : 4}
                      style={{
                        color:
                          theme === "dark"
                            ? undefined
                            : defaultTheme.colors.secondary,
                        marginTop: 8,
                        textAlign: isMobile ? "center" : undefined,
                      }}
                    >
                      Enviamos um token para {data?.phone} via SMS, use esse
                      token como acesso temporário e mude sua senha pelo painel.
                    </Typography.Title>
                    <Progress percent={count} />
                  </Col>
                </Row>
              ) : confirmedChannel === "EMAIL" ? (
                <Row style={{ marginTop: isMobile ? 8 : 64, width: "100%" }}>
                  <Col xs={{ span: 24 }} md={{ span: 3 }} />

                  {isMobile && (
                    <Col
                      xs={{ span: 24 }}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Typography.Title
                        level={2}
                        style={{
                          color:
                            theme === "dark"
                              ? undefined
                              : defaultTheme.colors.primary,
                        }}
                      >
                        SMS enviado para {data?.email}
                      </Typography.Title>
                    </Col>
                  )}
                  <Col xs={{ span: 24 }} md={{ span: 10 }}>
                    <img
                      src={ForgotPassword}
                      style={{
                        width: "70%",
                        marginLeft: isMobile ? 50 : 0,
                        marginTop: !isMobile ? "4vh" : 0,
                      }}
                    />
                  </Col>
                  <Col
                    xs={{ span: 22 }}
                    md={{ span: 8 }}
                    style={{
                      marginLeft: isMobile ? 0 : -40,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: isMobile ? "center" : undefined,
                      flexDirection: "column",
                    }}
                  >
                    {!isMobile && (
                      <Typography.Title
                        style={{
                          color:
                            theme === "dark"
                              ? undefined
                              : defaultTheme.colors.primary,
                        }}
                      >
                        Email enviado para {data?.email}
                      </Typography.Title>
                    )}

                    <Typography.Title
                      level={isMobile ? 5 : 4}
                      style={{
                        color:
                          theme === "dark"
                            ? undefined
                            : defaultTheme.colors.secondary,
                        marginTop: 8,
                        textAlign: isMobile ? "center" : undefined,
                      }}
                    >
                      Enviamos um token para {data?.email} via email, use esse
                      token como acesso temporário e mude sua senha pelo painel.
                    </Typography.Title>
                    <Progress percent={count} />
                  </Col>
                </Row>
              ) : (
                <Row style={{ marginTop: isMobile ? 8 : 64, width: "100%" }}>
                  <Col xs={{ span: 24 }} md={{ span: 3 }} />

                  {isMobile && (
                    <Col
                      xs={{ span: 24 }}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Typography.Title
                        level={2}
                        style={{
                          color:
                            theme === "dark"
                              ? undefined
                              : defaultTheme.colors.primary,
                        }}
                      >
                        Não foi possivel enviar o token.
                      </Typography.Title>
                    </Col>
                  )}
                  <Col xs={{ span: 24 }} md={{ span: 10 }}>
                    <img
                      src={ForgotPassword}
                      style={{
                        width: "70%",
                        marginLeft: isMobile ? 50 : 0,
                        marginTop: !isMobile ? "4vh" : 0,
                      }}
                    />
                  </Col>
                  <Col
                    xs={{ span: 22 }}
                    md={{ span: 8 }}
                    style={{
                      marginLeft: isMobile ? 0 : -40,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: isMobile ? "center" : undefined,
                      flexDirection: "column",
                    }}
                  >
                    {!isMobile && (
                      <Typography.Title
                        style={{
                          color:
                            theme === "dark"
                              ? undefined
                              : defaultTheme.colors.primary,
                        }}
                      >
                        Não foi possivel enviar o token.
                      </Typography.Title>
                    )}

                    <Typography.Title
                      level={isMobile ? 5 : 4}
                      style={{
                        color:
                          theme === "dark"
                            ? undefined
                            : defaultTheme.colors.secondary,
                        marginTop: 8,
                        textAlign: isMobile ? "center" : undefined,
                      }}
                    >
                      Esse usuário não existe ou não possui email ou telefone
                      validado. Caso este usuário exista, entre em contato com o
                      suporte.
                    </Typography.Title>
                    <Progress percent={count} status="exception" />
                  </Col>
                </Row>
              )}
            </Content>
          </Col>
        </Row>

        <Footer style={{ textAlign: "center" }}>
          <Typography style={{ opacity: 0.6 }}>
            Copyright ©{" "}
            <Typography.Link
              href="https://paybrokers.com.br/"
              target="_blank"
              style={{
                color: theme === "dark" ? "#fff" : "#4a4a4a",
                textDecoration: "underline",
              }}
            >
              PayBrokers
            </Typography.Link>{" "}
            2023.
          </Typography>
        </Footer>
      </Layout>
    </>
  );
};
