import { SendOutlined } from "@ant-design/icons";
import ForgotPassword from "@assets/forgot.svg";
import { useTheme } from "@src/contexts/ThemeContext";
import { defaultTheme } from "@src/styles/defaultTheme";
import {
  Breadcrumb,
  Button,
  Col,
  Form,
  Input,
  Layout,
  Row,
  Typography,
} from "antd";
import { Content, Footer } from "antd/es/layout/layout";
import { useMediaQuery } from "react-responsive";

export const ForgotMyPassword = () => {
  const { theme } = useTheme();
  const isMobile = useMediaQuery({ maxWidth: "750px" });

  return (
    <>
    {import.meta.env.VITE_APP_COMPANY_NAME === "Paybrokers" &&  <img
        src={import.meta.env.VITE_APP_ICON}
        style={{
          position: "fixed",
          width: "105vh",
          left: "-12vw",
          top: 25
        }}
      />}
    
    <Layout className="layout" style={{ height: "100vh" }}>
     
      <Breadcrumb style={{ margin: "16px 64px", fontSize: isMobile ? 14 : 18 }}>
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
                  style={{ marginTop: 16, width: isMobile ? "90%" : "100%" }}
                >
                  <Form.Item label="Usuário">
                    <Input
                      disabled
                      style={{ width: "100%" }}
                      size="large"
                      placeholder="ExemploDeUsuário"
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      size="large"
                      type="primary"
                      style={{ width: "100%" }}
                    >
                      <SendOutlined />
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
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
