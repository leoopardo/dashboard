/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ClockCircleOutlined,
  DollarOutlined,
  DownOutlined,
  HomeOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import banner3 from "@assets/bet-banner.jpg";
import brazil from "@assets/brazil-.png";
import banner1 from "@assets/cassino-banner.jpg";
import banner2 from "@assets/footbal-bet.png";
import logo from "@assets/paysbet.png";
import eua from "@assets/united-states.png";
import VideogameAssetOutlinedIcon from "@mui/icons-material/VideogameAssetOutlined";
import { useCreateQrCodeReserve } from "@src/services/FASTPIX/postReserveQrCode";
import { useValidateFastPix } from "@src/services/FASTPIX/siginIn/validate";
import { queryClient } from "@src/services/queryClient";
import { defaultTheme } from "@src/styles/defaultTheme";
import type { MenuProps } from "antd";
import {
  Avatar,
  Button,
  Carousel,
  Col,
  Divider,
  Dropdown,
  Layout,
  Menu,
  Row,
  Space,
  Spin,
  Typography,
  theme,
} from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { Outlet, useLocation, useNavigate } from "react-router";
import secureLocalStorage from "react-secure-storage";
import { GameCard } from "./components/gameCards";
import { LoginModal } from "./components/login";
import "./styles.css";

const { Header, Sider } = Layout;

export const Paysbet = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const isTablet = useMediaQuery({ maxWidth: "1150px" });
  const isMobile = useMediaQuery({ maxWidth: "750px" });
  window.document.title = "PAY'SBET";
  const location = useLocation();
  const navigate = useNavigate();
  const [type, setType] = useState<"123fixed" | "123free">("123fixed");
  const { t, i18n } = useTranslation();
  const {
    QrCodeReserveIsSuccess,
    QrCodeReserveIsLoading,
    QrCodeReserveMutate,
    QrCodeReserveData,
  } = useCreateQrCodeReserve(type);
  const [open, setOpen] = useState<boolean>(false);

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };
  const { refetchValidate, responseValidate, isValidateFetching } =
    useValidateFastPix();

  useEffect(() => {
    refetchValidate();
  }, []);

  const items: MenuProps["items"] = [
    {
      key: "pt-BR",
      label: t("menus.portuguese"),
      icon: <Avatar src={brazil} />,
      onClick: () => changeLanguage("pt-BR"),
    },
    {
      key: "en",
      label: t("menus.english"),
      icon: <Avatar src={eua} />,
      onClick: () => changeLanguage("en"),
    },
  ];

  const items1: MenuProps["items"] = responseValidate
    ? [
        {
          label: (
            <Dropdown menu={{ items }}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  {t("table.language")}
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          ),
          type: "group",
        },
        {
          label: (
            <Button
              type="dashed"
              size="large"
              onClick={() => QrCodeReserveMutate()}
              icon={<DollarOutlined />}
            >
              Novo depósito
            </Button>
          ),
          type: "group",
        },
        {
          label: `${t("login.user")}: ${responseValidate?.name}`,
          type: "group",
        },

        {
          label: `${t("table.balance")}: ${responseValidate?.balance}`,
          type: "group",
        },
      ]
    : [
        {
          label: (
            <Dropdown menu={{ items }}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  {t("table.language")}
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          ),
          type: "group",
        },
        {
          label: (
            <Button type="dashed" size="large" onClick={() => setOpen(true)}>
              {t("paysbet.login")}
            </Button>
          ),
          type: "group",
          style: { marginRight: -20 },
        },
        {
          label: (
            <Button type="primary" size="large">
              {t("paysbet.signin")}
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
    style?: any,
    onClick?: () => void
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
      type,
      style,
      onClick,
    } as MenuItem;
  }
  const items2: MenuProps["items"] = [
    getItem(
      t("paysbet.home"),
      "start",
      <HomeOutlined />,
      undefined,
      undefined,
      undefined,
      () => navigate("/paysbet")
    ),
    getItem(
      t("paysbet.all_games"),
      "grp1",
      null,
      [
        getItem(t("paysbet.live_betting"), "live", <ClockCircleOutlined />, [
          getItem("Cassino", "5", null, undefined, undefined, undefined, () =>
            navigate("cassino")
          ),
        ]),

        { type: "divider" },

        getItem(
          t("paysbet.games"),
          "sub4",
          <VideogameAssetOutlinedIcon style={{ fontSize: 18 }} />,
          [
            getItem(
              t("paysbet.little_plane"),
              "9",
              null,
              undefined,
              undefined,
              undefined,
              () => navigate("aviator")
            ),
            getItem("Cassino", "10", null, [
              getItem(
                t("paysbet.roulette"),
                "11",
                null,
                undefined,
                undefined,
                undefined,
                () => navigate("roulette")
              ),
            ]),
            getItem(
              t("paysbet.little_car"),
              "12",
              null,
              undefined,
              undefined,
              undefined,
              () => navigate("car")
            ),
          ]
        ),
      ],
      "group"
    ),

    getItem(
      t("paysbet.configurations"),
      "grp",
      null,
      [
        getItem(
          t("paysbet.profile"),
          "myUser",
          <UserOutlined />,
          undefined,
          undefined,
          undefined,
          () => navigate("profile")
        ),
        getItem(
          t("paysbet.logout"),
          "logout",
          <LogoutOutlined />,
          undefined,
          undefined,
          {
            color: "red",
          },
          () => {
            secureLocalStorage.removeItem("FastPixToken");
            sessionStorage.removeItem("FastPixToken");
            queryClient.removeQueries();
            refetchValidate();
          }
        ),
      ],
      "group",
      { display: responseValidate ? undefined : "none" }
    ),
  ];

  useEffect(() => {
    if (QrCodeReserveData?.token)
      window.open(
        `https://fastpix.hmg.paybrokers.com.br/${QrCodeReserveData?.token}`
      );
  }, [QrCodeReserveIsSuccess]);

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
        <Col span={16} style={{ display: "flex", justifyContent: "flex-end" }}>
          {isValidateFetching ? (
            <Spin />
          ) : (
            <Menu
              theme="light"
              mode="horizontal"
              defaultSelectedKeys={["2"]}
              items={items1}
              style={{ display: "flex", alignItems: "center" }}
            />
          )}
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
          {location.pathname === "/paysbet" ? (
            <Row style={{ padding: 20, margin: 0, minHeight: "70dvh" }}>
              <Col span={24}>
                <Carousel
                  style={{ borderRadius: 16 }}
                  arrows
                  autoplaySpeed={3000}
                  autoplay={!!responseValidate}
                >
                  {!responseValidate && (
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
                              FastPix (Fixo)
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
                                {t("paysbet.imediattly")}
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
                                {t("paysbet.easy")}
                              </Typography.Title>
                            </div>
                          </Col>
                          <Col span={24}>
                            <div style={{ marginTop: "15px" }}>
                              <Button
                                type="primary"
                                size="large"
                                style={{ height: "70px", fontSize: "20px" }}
                                onClick={() => {
                                  setType("123fixed");
                                  QrCodeReserveMutate();
                                }}
                                loading={QrCodeReserveIsLoading}
                              >
                                {t("paysbet.start_now")}
                              </Button>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  )}
                  {!responseValidate && (
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
                              FastPix (Livre)
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
                                {t("paysbet.imediattly")}
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
                                {t("paysbet.easy")}
                              </Typography.Title>
                            </div>
                          </Col>
                          <Col span={24}>
                            <div style={{ marginTop: "15px" }}>
                              <Button
                                type="primary"
                                size="large"
                                style={{ height: "70px", fontSize: "20px" }}
                                onClick={() => {
                                  setType("123free");
                                  QrCodeReserveMutate();
                                }}
                                loading={QrCodeReserveIsLoading}
                              >
                                {t("paysbet.start_now")}
                              </Button>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  )}

                  <div>
                    <img
                      src={banner1}
                      style={{
                        width: "100%",
                        height: "65dvh",
                        borderRadius: 8,
                      }}
                    />
                  </div>
                  <div>
                    <img
                      src={banner2}
                      style={{
                        width: "100%",
                        height: "65dvh",
                        borderRadius: 8,
                      }}
                    />
                  </div>
                  <div>
                    <img
                      src={banner3}
                      style={{
                        width: "100%",
                        height: "65dvh",
                        borderRadius: 8,
                      }}
                    />
                  </div>
                </Carousel>
              </Col>
              <Divider orientation="left">{t("paysbet.popular_games")}</Divider>
              {/* <Row gutter={16} justify="space-between">
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
                          {t("paysbet.tie")}
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
                          {t("paysbet.tie")}
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
                          {t("paysbet.tie")}
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
              </Row> */}
              <Row style={{ width: "100%" }} gutter={[8, 16]}>
                {[
                  {
                    name: "Aviãozinho",
                    banner:
                      "data:image/jpeg;base64,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",
                  },
                  {
                    name: "Tigrão",
                    banner:
                      "https://s2-techtudo.glbimg.com/QBNvwVwrUaIrN6J4kwqUP5rG9EQ=/1200x/smart/filters:cover():strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2023/B/W/QdZUZSSfGwB93jjcFFfA/fortune-tiger.png",
                  },
                  {
                    name: "Estrela",
                    banner:
                      "https://res.cloudinary.com/aposta10/image/upload/c_limit,w_1919/f_webp/q_60/v1700523089/stelar-estrelabet-capa-czvazi?_a=BAVAr0IB0",
                  },
                  {
                    name: "Astronauta",
                    banner:
                      "https://www.brasil247.com/sites/wp-content/uploads/sites/101/2023/07/Spaceman.jpeg.webp",
                  },
                  {
                    name: "Cassino",
                    banner:
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4ec36V-rlK7WDvN5tOzulCWegaEU5AnkyUw&usqp=CAU",
                  },
                  {
                    name: "Touro",
                    banner:
                      "https://cdn.coingaming.io/casino-hub88/PGsoft/fortune-ox-thumbnail.jpg",
                  },
                  {
                    name: "Panda hiphop",
                    banner:
                      "https://d3fwl9ttzumvxe.cloudfront.net/games/e5f358bc746ce1fc27d5699c54b6f137.png",
                  },
                  {
                    name: "Cartas",
                    banner:
                      "data:image/jpeg;base64,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",
                  },
                  {
                    name: "Zeus",
                    banner:
                      "https://d3fwl9ttzumvxe.cloudfront.net/games/29d8559e14cc09c33509d4e455e4ada8.png",
                  },
                  {
                    name: "Candy",
                    banner:
                      "https://d3fwl9ttzumvxe.cloudfront.net/games/c77fa594da0490f2c298f9a9f518266b.png",
                  },
                ].map((game) => (
                  <GameCard banner={game.banner} name={game.name} />
                ))}
              </Row>
            </Row>
          ) : (
            <Outlet />
          )}
        </Layout>
        {open && <LoginModal open={open} setOpen={setOpen} />}
      </Layout>
    </Layout>
  );
};
