/* eslint-disable @typescript-eslint/no-explicit-any */
import "./styles.css";
import {
  ClockCircleOutlined,
  HomeOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import banner3 from "@assets/bet-banner.jpg";
import banner1 from "@assets/cassino-banner.jpg";
import banner2 from "@assets/footbal-bet.png";
import logo from "@assets/paysbet.png";
import VideogameAssetOutlinedIcon from "@mui/icons-material/VideogameAssetOutlined";
import { defaultTheme } from "@src/styles/defaultTheme";
import type { MenuProps } from "antd";
import Uruguai from "@assets/uruguai.png";
import {
  Button,
  Carousel,
  Col,
  Layout,
  Menu,
  Row,
  Space,
  Typography,
  theme,
  Divider,
} from "antd";
import { Content } from "antd/es/layout/layout";
import React from "react";
import { useMediaQuery } from "react-responsive";
const { Header, Sider } = Layout;

const items1: MenuProps["items"] = [
  {
    label: (
      <Button type="dashed" size="large">
        ENTRAR
      </Button>
    ),
    type: "group",
    style: { marginRight: -20 },
  },
  {
    label: (
      <Button type="primary" size="large">
        CADASTRE-SE
      </Button>
    ),
    type: "group",
  },
];
type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group",
  style?: any
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
    style,
  } as MenuItem;
}
const items2: MenuProps["items"] = [
  getItem("Início", "start", <HomeOutlined />),
  getItem(
    "Todos os jogos",
    "grp",
    null,
    [
      getItem("Apostas ao vivo", "live", <ClockCircleOutlined />, [
        getItem("Cassino", "5"),
      ]),

      { type: "divider" },

      getItem(
        "Jogos",
        "sub4",
        <VideogameAssetOutlinedIcon style={{ fontSize: 18 }} />,
        [
          getItem("Aviãozinho", "9"),
          getItem("Cassino", "10", null, [getItem("Roleta", "11")]),
          getItem("Carrinho", "12"),
          getItem("Option 12", "13"),
        ]
      ),
    ],
    "group"
  ),

  getItem(
    "Configurações",
    "grp",
    null,
    [
      getItem("Meu usuário", "myUser", <UserOutlined />),
      getItem("Sair", "logout", <LogoutOutlined />, undefined, undefined, {
        color: "red",
      }),
    ],
    "group"
  ),
];

export const Paysbet = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const isTablet = useMediaQuery({ maxWidth: "1150px" });
  const isMobile = useMediaQuery({ maxWidth: "750px" });

  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          padding: 30,
        
          boxShadow: "0px 0px 11.1px 1px rgba(0, 0, 0, 0.11)",
          zIndex: 99,
        }}
      >
        <Row style={{ width: "100%" }}>
          <Col span={4}>
            <img src={logo} style={{ marginTop: 24 }} />
          </Col>
        </Row>
        <Col span={5}>
          <Menu
            theme="light"
            mode="horizontal"
            defaultSelectedKeys={["2"]}
            items={items1}
            style={{ width: "100%" }}
          />
        </Col>
      </Header>
      <Layout style={{ minHeight: "93dvh" }}>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            items={items2}
          />
        </Sider>
        <Layout style={{ padding: "0 16px 16px" }}>
          <Row style={{ padding: 20, margin: 0, minHeight: "70dvh" }}>
            <Col span={24}>
              <Carousel
                style={{ borderRadius: 16 }}
                arrows
                autoplaySpeed={3000}
              >
                <div>
                  <div
                    style={{
                      background: `linear-gradient(90deg, ${defaultTheme.colors.primary} 0%, ${defaultTheme.colors.secondary} 100%)`,
                      height: "65dvh",
                      width: "100%",
                      borderRadius: 8,
                    }}
                  >
                    <Row
                      style={{
                        width: "100%",
                        position: "absolute",
                        top: 40,
                        marginLeft: 50,
                      }}
                    >
                      <Col
                        span={24}
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Typography.Title
                          level={1}
                          style={{
                            color: "#fff",
                            fontSize: 60,
                          }}
                        >
                          FastPix
                        </Typography.Title>
                      </Col>

                      <Col span={24}>
                        <div style={{ width: "90vw" }}>
                          <Typography.Title
                            level={1}
                            style={{
                              color: "#fff",
                              fontSize: isMobile ? 15 : isTablet ? 30 : 35,
                              maxWidth: "70%",
                              wordBreak: "break-word",
                            }}
                          >
                            Faça um pix agora e comece a apostar imediatamente.
                          </Typography.Title>
                        </div>
                      </Col>
                      <Col span={24}>
                        <div style={{ width: "90vw" }}>
                          <Typography.Title
                            level={1}
                            style={{
                              color: "#fff",
                              fontSize: isMobile ? 15 : isTablet ? 20 : 25,
                              maxWidth: "70%",
                              wordBreak: "break-word",
                            }}
                          >
                            Simples e descomplicado, leia nosso QrCode,
                            selecione o valor e já terá sua conta para apostar
                          </Typography.Title>
                        </div>
                      </Col>
                      <Col span={24}>
                        <div style={{ marginTop: "15px" }}>
                          <Button
                            type="primary"
                            size="large"
                            style={{ height: "70px", fontSize: "20px" }}
                          >
                            Comece agora mesmo!
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
                <div>
                  <img
                    src={banner1}
                    style={{ width: "100%", height: "65dvh", borderRadius: 8 }}
                  />
                </div>
                <div>
                  <img
                    src={banner2}
                    style={{ width: "100%", height: "65dvh", borderRadius: 8 }}
                  />
                </div>
                <div>
                  <img
                    src={banner3}
                    style={{ width: "100%", height: "65dvh", borderRadius: 8 }}
                  />
                </div>
              </Carousel>
            </Col>
          </Row>

          <Content
            style={{
              padding: "0 24px 24px 24px",
              margin: 0,
              minHeight: 280,
            }}
          >
            <Divider orientation="left">Últimos jogos</Divider>

            <Row gutter={16} justify="space-between">
              <Col span={8}>
                <Row
                  style={{
                    background: "white",
                    padding: 10,
                    borderRadius: 10,
                    position: "relative",
                    minHeight: "200px",
                    maxWidth: "400px",
                  }}
                >
                  <img
                    className="img2"
                    width={"100%"}
                    height={121}
                    src="https://static.significados.com.br/foto/argentina.jpg"
                  />
                  <img
                    className="img"
                    width={"100%"}
                    height={121}
                    src="https://www.gov.br/planalto/pt-br/conheca-a-presidencia/acervo/simbolos-nacionais/bandeira/bandeira-nacional-brasil.jpg/@@images/image"
                  />

                  <Col
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      background: "white",
                      borderRadius: "17px",
                      marginTop: "125px",
                      gap: 5,
                    }}
                    span={24}
                  >
                    <Space
                      direction="vertical"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        background: "white",
                        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                        borderRadius: "11px",
                        width: "93px",
                        minHeight: "43px",
                        padding: "5px",
                        gap: 0,
                      }}
                    >
                      <Typography
                        style={{
                          fontSize: "16px",
                          fontWeight: 800,
                          color: "#3FBCBC",
                          lineHeight: "22px",
                        }}
                      >
                        3.45
                      </Typography>

                      <Typography
                        style={{ lineHeight: "22px", fontSize: "16px" }}
                      >
                        Brasil
                      </Typography>
                    </Space>

                    <Space
                      direction="vertical"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        background: "white",
                        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                        borderRadius: "11px",
                        width: "93px",
                        minHeight: "43px",
                        padding: "5px",
                        gap: 0,
                      }}
                    >
                      <Typography
                        style={{
                          fontSize: "16px",
                          fontWeight: 800,
                          color: "#3FBCBC",
                          lineHeight: "22px",
                        }}
                      >
                        2.32
                      </Typography>

                      <Typography
                        style={{ lineHeight: "22px", fontSize: "16px" }}
                      >
                        Empate
                      </Typography>
                    </Space>

                    <Space
                      direction="vertical"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        background: "white",
                        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                        borderRadius: "11px",
                        width: "93px",
                        minHeight: "43px",
                        padding: "5px",
                        gap: 0,
                      }}
                    >
                      <Typography
                        style={{
                          fontSize: "16px",
                          fontWeight: 800,
                          color: "#3FBCBC",
                          lineHeight: "22px",
                        }}
                      >
                        1.47
                      </Typography>

                      <Typography
                        style={{ lineHeight: "22px", fontSize: "16px" }}
                      >
                        Argentina
                      </Typography>
                    </Space>
                  </Col>
                </Row>
              </Col>

              <Col span={8}>
                <Row
                  style={{
                    background: "white",
                    padding: 10,
                    borderRadius: 10,
                    position: "relative",
                    minHeight: "200px",
                    maxWidth: "400px",
                  }}
                >
                  <img
                    className="img2"
                    width={"100%"}
                    height={121}
                    src="https://upload.wikimedia.org/wikipedia/commons/e/ec/Flag_of_Paraguay_%281990%E2%80%932013%29.svg"
                  />
                  <img
                    className="img"
                    width={"100%"}
                    height={121}
                    src="https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Colombia.svg"
                  />

                  <Col
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      background: "white",
                      borderRadius: "17px",
                      marginTop: "125px",
                      gap: 5,
                    }}
                    span={24}
                  >
                    <Space
                      direction="vertical"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        background: "white",
                        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                        borderRadius: "11px",
                        width: "93px",
                        minHeight: "43px",
                        padding: "5px",
                        gap: 0,
                      }}
                    >
                      <Typography
                        style={{
                          fontSize: "16px",
                          fontWeight: 800,
                          color: "#3FBCBC",
                          lineHeight: "22px",
                        }}
                      >
                        3.45
                      </Typography>

                      <Typography
                        style={{ lineHeight: "22px", fontSize: "16px" }}
                      >
                        Paraguai
                      </Typography>
                    </Space>

                    <Space
                      direction="vertical"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        background: "white",
                        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                        borderRadius: "11px",
                        width: "93px",
                        minHeight: "43px",
                        padding: "5px",
                        gap: 0,
                      }}
                    >
                      <Typography
                        style={{
                          fontSize: "16px",
                          fontWeight: 800,
                          color: "#3FBCBC",
                          lineHeight: "22px",
                        }}
                      >
                        2.32
                      </Typography>

                      <Typography
                        style={{ lineHeight: "22px", fontSize: "16px" }}
                      >
                        Empate
                      </Typography>
                    </Space>

                    <Space
                      direction="vertical"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        background: "white",
                        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                        borderRadius: "11px",
                        width: "93px",
                        minHeight: "43px",
                        padding: "5px",
                        gap: 0,
                      }}
                    >
                      <Typography
                        style={{
                          fontSize: "16px",
                          fontWeight: 800,
                          color: "#3FBCBC",
                          lineHeight: "22px",
                        }}
                      >
                        1.47
                      </Typography>

                      <Typography
                        style={{ lineHeight: "22px", fontSize: "16px" }}
                      >
                        Colômbia
                      </Typography>
                    </Space>
                  </Col>
                </Row>
              </Col>

              <Col span={8}>
                <Row
                  style={{
                    background: "white",
                    padding: 10,
                    borderRadius: 10,
                    position: "relative",
                    minHeight: "200px",
                    maxWidth: "400px",
                  }}
                >
                  <img
                    className="img2"
                    width={"100%"}
                    height={121}
                    style={{ marginLeft: -15 }}
                    src={Uruguai}
                  />
                  <img
                    className="img"
                    width={"100%"}
                    height={121}
                    src="https://i.pinimg.com/originals/fd/90/4a/fd904a378b57e1b3f3059f78963781c0.jpg"
                  />

                  <Col
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      background: "white",
                      borderRadius: "17px",
                      marginTop: "125px",
                      gap: 5,
                    }}
                    span={24}
                  >
                    <Space
                      direction="vertical"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        background: "white",
                        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                        borderRadius: "11px",
                        width: "93px",
                        minHeight: "43px",
                        padding: "5px",
                        gap: 0,
                      }}
                    >
                      <Typography
                        style={{
                          fontSize: "16px",
                          fontWeight: 800,
                          color: "#3FBCBC",
                          lineHeight: "22px",
                        }}
                      >
                        3.45
                      </Typography>

                      <Typography
                        style={{ lineHeight: "22px", fontSize: "16px" }}
                      >
                        Uruguai
                      </Typography>
                    </Space>

                    <Space
                      direction="vertical"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        background: "white",
                        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                        borderRadius: "11px",
                        width: "93px",
                        minHeight: "43px",
                        padding: "5px",
                        gap: 0,
                      }}
                    >
                      <Typography
                        style={{
                          fontSize: "16px",
                          fontWeight: 800,
                          color: "#3FBCBC",
                          lineHeight: "22px",
                        }}
                      >
                        2.32
                      </Typography>

                      <Typography
                        style={{ lineHeight: "22px", fontSize: "16px" }}
                      >
                        Empate
                      </Typography>
                    </Space>

                    <Space
                      direction="vertical"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        background: "white",
                        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                        borderRadius: "11px",
                        width: "93px",
                        minHeight: "43px",
                        padding: "5px",
                        gap: 0,
                      }}
                    >
                      <Typography
                        style={{
                          fontSize: "16px",
                          fontWeight: 800,
                          color: "#3FBCBC",
                          lineHeight: "22px",
                        }}
                      >
                        1.47
                      </Typography>

                      <Typography
                        style={{ lineHeight: "22px", fontSize: "16px" }}
                      >
                        Chile
                      </Typography>
                    </Space>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
