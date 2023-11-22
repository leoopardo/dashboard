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
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const {
    QrCodeReserveIsSuccess,
    QrCodeReserveIsLoading,
    QrCodeReserveMutate,
    QrCodeReserveData,
  } = useCreateQrCodeReserve();
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
        `https://d3hpel0fquw4yd.cloudfront.net/${QrCodeReserveData?.token}`
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
                                onClick={() => QrCodeReserveMutate()}
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
              <Row style={{ width: "100%" }} gutter={[8, 8]}>
                {[
                  {
                    name: "Aviãozinho",
                    banner:
                      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEg8SEhIQFRAQDw8PDQ8PDw8PDw8NFREWFhURFRUYHSggGBolGxUVITEhJSkrLi4uFx80OTQsOCgtLisBCgoKDg0OFxAQFy0dHR0tLS0tLS0tKy0uLS0rLS0tLS0tLSstKy0uKy0wLS0tLS0rLSstKy0tKy0tLS0tLS0tLf/AABEIAKMBNgMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAACAwABBAUGB//EAEEQAAICAQICBgQMBAUFAQAAAAECAAMRBBIFIRMiMTJBUVJhcZEGFEJicoGCoaKxstEzktLhFSPBwvBTc6Pi8UP/xAAbAQACAwEBAQAAAAAAAAAAAAABAgADBAUGB//EADwRAAEEAAQDBgMFBQkBAAAAAAEAAgMRBBIhMQVBURMiYXGRoVKBsSMywdHwBhQzQoIVJFRykqLS4fEW/9oADAMBAAIRAxEAPwD4qBLzKJkAmu0FRMgWFiVmSlFYEkkqMgizAzIRLim01K1aWRKAhSBBLKwtkhEmDFpRDCEEiEqwKKESCHiTEIUtQCFBl5joK5IOZcCiuSDIJFEWYUCTMiiZKg5lbpFEeZe8wMyopAO6Zri3UGk3fntEogecCVEyDkaVvbk/fAd9fUIjWYBEuXvMHeHj7IfZHqPQ/kUO6VmGX9UsBT5w5jzCnZt5PHz0QSiJqTTDz9/945dAfAj3Qdo3ma81YMJO7VjMw8CD+K5pEvBnROjb0fvH+kg0reifqMYOadnBUOinbvE4f0n8lgVZJsNZ8j90kbTqqMz/AIfYrnAS8zpaDhpfnNGr4Rjsi9swHLa6DcHK5uYBcSXGW0FYqWg2szmlpoqSS5IUqkuDJAoiliDLkQRSw0HMkiiKEVixLzFpREGlmLaUDAUUYjNkWsNDiQ6ItOqHZKIjrDFYhBTPaBoFWZMy9kvo5LCXKeiDMuPo05ZtoxnBPM4HIZ7Yjb/fPgfKSwiWECyND+H/AKFRMqXiViRIpLzKkkURBpeYMqBFHJBzJmBRHiaKKM9kRV2zoaZsER2hUTOOyG3TFRkxmjoDGdDXHKCYNIhyIQSVQQLW+3TFcdY+/E3aas45n8Kn84LJkCGGxKS0HcLZFiZ4zbJHDyc4fisd9ZJPZ7hJJZb1jJIImfCFYeIYon+K71XK0HE9vKdZdcrCeVKGElpErfh2uNhdTDcQkhoOGi9Bfpw05Oq0JHZG6fX+c3rcrCVjPH5LqOGFxrdNCvOsuIM7Wp0oPZOXbSRNTJA5cDFYN8J8EqVCmjT6Ut2S1YnENFlZpJ0/8KaLfhzCHIVWMRGeawS5obSMPCIZCIKVgc07FVCAklo0Upm76oujk6GNDyw0rJK0BjUCVSOkZKYwAlM5gpAkaFEz5hl4xCrY8DdMJAi3sgbpUIag6QnZaNHaFdGbuqx3g9hrPJh7iZ0ON8P6Niw5ruALdu4fJJ9fLB+o+M52n0z2dxHf1ojMPeJ6ShGtoeh0YXKgwCveAOUb8O36pTI7KQfVdvhmFOJw8kLmnXvMNGi4CqvbUAehXlCJU0BIDVy9efKVLxJiSAoKtsrEOXIilyYjAJpWqKTSdkZesiHBmqpoi1JEaM1yplj1pdY6wYxCq1oE5JeCbI1hUhjl17uIE9kpteSJyelldMYNE2Qrc1p85Ji6aSS1OyXcs0izJdohOhcD4TBbaROfG53Ve6xkcIHeYsNmkIgKWWa/jIkLgzUHHmFw3RRXcbqV06rzjLFDTMah4S1yIhAuwre0fVP1CzW04M73BKhic5ucdpNTsM1Qya6ricTwjnRkxr09+nwBFDTZGZiXigI7YY4iMYzNV6brzYjIdq0qXaUeU4/EtKBznV+PDznL4lqgYD4rTBmDhVrjESSGWBM67IUAjKlhIsOVkrQyPmo7RLGei4RqKFrJIRbF75fLM/0P6VnQu0KN/eulh+Jd33ygzZTRC9BDwI4mIPZKDY2A287I6dBqvGYnXr4Oy4D1u7nsrBKVJ/3Lf9B750rOEg8wKfPdm+oj2bWI+6GRev8A1z45W7T3Z+yyAyOmv7pV2G4GICTiGl3TKM3nYILb2q7A13SNbQqKvSfF0HywF3IV+Yv8Qv2c8iZqk3Z+LaRdvPFtx6Q/UHO3z84KFamLMCXb5Ws09v3FWb8p0NRxno222J1goKFXO07h1e8oYRacBQF+3tz9VrcYHEvleIsumgDnDeu9Tgy96DQb/mXJ1yOa0Z7Wfe4CbiVA2r1wU8CDgfZnTos30KxLbtP1LCvfFXpD7O1vsQE09tqhT1KiMu1ozY9m4sbVX5LHcfqmixKdODgsXKbSm45fyZl+TA5wNNG98v1+aWHDvY987jURbTi+7vexZLnUdidwaBOhPP4vTtZcIAu3qE43P6TN87/1nNdZ6Jq+l0ydu5FAHnuU7SPrxPPMZohdYrmFwOM4fJMJW/clAc30Gny+lLM6wIbmBHXHCqXmXj+0qBRWGmyhsiY1TM6emoxKpSAFuwUTnu02WLUDnETo6usTnFIWPsJcTAWPUklSsyxZVe2TbJmXmRBVtkhZkkRXcq1wMayq088CRNFOqIlDoObV6SDi2mWYaLTqdH5TA6ETppqgYNoBha8t0Kz4iCKTvRlc1bSI5NRBtpiCsuAa4LmF8kRXRVwYLrMAfEdXqIhYQrRiQ4U4KrARAFh85obBmdllrCVjmjaDYRLYfORucXvxBLw5lTlHRGVjdPSWOFGT7VAA8SSewRAabdDq+jLHYjPgbGfmK29IL5wOutFpw7WOkaJHU3mRv8t9fbqVtfgtgTcpR/EKm7JHzd3enLYnHLt8PbPRU8TssAZOdta4u05Axav/AFK27Q3jj/hli0agdKy2V+leSqox8vn+6ZxI5v3x6L0k/DMNOAcI7LYujdEcyDrVHQg7eAolC6umohaQHsJ2nUW7gvtX5WO0csfXOvW1jAdXbjk9jod7eZWv5P1n6py6dfUnLTVGx/TwxOP1fpjBptXYQ7v0QHrChR9Fe37RlT2Xvp57+i6eDxBY3Kz7TwiFMb175oHrd340uyFz2CZrdagOAS7+hUN7+vOOz65g1OtpHK22y4nkUrHR1dvzcBvrJmSzj5AxVWlaeXfyfZjAiNhceX4f9rXieNQR7vA8B3j4ju90Hzd8l2wdQ3PlSnq23W4/SPvibeJ11jBsNjD0SrH+ZQAJ5m/VPZ32Lepjy/l7IAMvbhuvt+a4M37SOZfYgknm83/tbTR8vddfVcZsbkvUHzeb/wA37TnbsRYjAs0BrWCgFwJ8XPi35pHlx8eXkNh8lt4drDWy+ecgeePk/a/PExa9cO4HdzlOWP8ALbrL+EiEEhtXnmSSfEk5MrLgHWtZbLJhxC7+U2D0BGo+eh+S5xEm2dAUCGNOIO1CoHD5CudtlbZ1BQJfxcRe2CccNek6Wgds2YlKuIJMzuOY2urDEIm0surmMIZ1SgMsViO2UAUs8uCdI/Na5RoJhjRmdUKJfKQzJRw1vMrljRGMXQGdHcJDYIO1cnHD4m7rn/E8S5oeySHO5ZzDGDsuXAYQMmTnNi5xlBVgxqXmJ2mFtgq0jZS3ZaRbmUygzOqxm0wZOiu/ebHeCz3xOZqbTkwDpjDRWYkXogWwwulk6ExldMNIErOTLjXpgFJKUQgxqRYWeg+DvDFcGxxuAcIiHu5+UzefhFc8MFlbMDgpMXKIo9z6Adf1zXM0lqq6sd+EO7qNtf7JnZbV6QAEVF3PWIYuSrHmQd5x7pq4fxHpHZAlYpCMyDb8kEDreHPM5PHNOqWEKMLtVtvgpIHVH/PGVXndlNj5rtmJ2CwnawuZI0u3LNQerbJvbf26Hd8ILMbUCVr8wAn7+X3Tl3XM5y7Fz5uxJHs8oBWWFlzY2t2FLiYjHYnE/wAV5cOnL029lCYJndGupGm6IL1yuGTb/wDpn+Ju++ccpI1xdelIYvDtiyZJA+xZr+U9P1R6gKJDEGsR1NJZkUdrkAfvLLAWVsbnuDRuUotB6WbuJcNNIUl0O8sAFz8ntPP2ic4rEDg4WFbNh5cM8skGVw5LQmojFvmPbLCxCwFWMxcjV0VtEYHnL5xlTnMqdEtkfEDdELpZkBiecevZKCF045s2lIWMBYNrRJuxHDCRos0uKa12q2kwd4nPa8wd5hECrdxVvILoNqBFNq5jJlYjiELK/iUh2Tzqj4R1RJ7YnT1ZmzGBFeANk8LpJO84pe2SEWlytXELlZEBrIktKm8uXCpPWyWWiQI9FkBRKgaGHhBJRXMmqVELYwWRLUmAMw2VFryIt2iy8rGYVFN0uLKmXFtEI0qJ5hSR5hSZ6lB0Wk5A7hSfDn0lh/dpj0nG7WatFWpVLIg2h+Se/wApv4rrGqCFApZmbv55qoGez2rMcpc4hte69twuHC4aCbEMlJoZc2Uir6C7OtaLJ8GKCBYxBBZkrGeXdGf933RWhqW/UXsyhkHIA5A7dqH+VDOr8ZYVdIcB+h38uzc3d/0mX4NafbVk/Lft+YvL890QuNPd8luZhmB2Ewg7zWhzzY9LHm4rBfpkbVJWqKFGzeqkkHam9s/cJu1NVK2VJ0CE2esjYPP8/dM3AV3232+eeXrsbP6RNFB36uxueKa9in5+Np/U8Z1g18I91nwscboxI1rbml07o0aDrVjo0+qVxrTIq1hK0Ds57uc4Xw97LCbQVUJusHSPnbjJVd3kPdDvG/VVjwrAJ9qjf+0D4Q28618lZz6w3IfpaM0uORl76lJiWQNGJxWQdwhjRQoHQE1sTZ59E/htNNoDdAijeVGSTnHjM3BmQvZisZDvYj5OETuqg95msf5Wl9a0/wDksP8AU0R8G6cKzenYqD6Kj92MrvuuN6bDUrWyL+84WPK3NlLn91vTTl1tVxbFlgoCDpOr/mn5C43t1fogQbtPp6Nims2M57WJ7ucbsd2ThHXvvt8OYX7R6v4VlXdfVgeFW3/xrv8A1GNqDl5AWVmeWyM/ecrXPlkyMJaDTQ4jY6XodTrt0S+OcPRALFGOuUZee08icj3TdTw2oVKGRd3Rgu+TuBxzIMXxfrvRV6TF39hP7B4fHr8Ko9N2Y/RU/wBxFtxDRe6tMOFglxU/ZtysDRVCsxFny3aNPFZtRTT0QNaKCzbELEl+9zbveqYBRiD8Zk+Mxw14XBnxOGlcHZQ2gBoKHnomoI3EzrbBbVRS0lOMTE1upT2pBibdLAOsirNUTGa14WWebDuB6rPYMGVmUxzIJpC4xq9EWYdakyq0zOhp6cRHvpX4eEyO8FK68SNGNEXWzOASV1XubG1A7yTObJJdkWAzk6rnbZYEZtk2y+lhVKJoQRSiNUxgEqYTKSAxgq8ZRa8wSInpJYskQApMNYi84jOki5CFAi3RZMuwQKxzi0mXU4GVW0M52hUcqTnvMMfkxj+M3h2Gw5UJgH5zdp/TOeGkLReyGbMugOIvbhDhQAGk2TzP4chy5Lu8R11TVWAPzIXam1g2A69XMKrVVCkV9Ko/ytjEK+Q7d75PrM867RW6Vfu4qrPVdD/6GbtTKWNstDf5trJ+Lna7lnEK66zXp93PttY88+Y9cVwPXLUbFfqh9pDYJ7u7kf5pyQ862m4HY6h1ava45bi2fuWF7GNaQ47oYTGY3EYlr4GAmMaNAAaAdDQsdet+PJaF1iJe7gsyuCCezG7B5ezELWtpnY2Gxj1VHRKrDdt5YyVil+D948ave/8ATDPALvOv+Z/6ZVmisHPqBX60XSycTyuY7DhzS4uoi6J/qGmuxtHxPX1W1Hrnf1XVdrAg57pl8I4hUK1R22Fd/g53BmLbgR7ZnPwdu86ve/8ATMmv4W9IBYqQSR1CScgZ8RAGxkZA5CbE8ThlOLkgApuU9Ku/ivfotXCNclW9DnaSGR8Z8Mc8erE0pqNNU9lgdnazd1QrcgxyQOr5zzmZeZYYgST13XIh47NFGxga05Lykg2PLUbXpdrtaLWq15tsIQKh2AAnBxtC8vm5mfjeqD2DYcoqKqn19p/56pzwZUIjAdmVEnFpX4cwGu87MTzJ8eXTlyCHMsSwIWI5XNaLVh4tpBCxABSZzyRSXLxDxJiFIgCwgssCadPT4mK5wAV0UZkNBM01XiY53lO0yXWzPq4rr2yBlIrr5lJJg9scglwbS5z5DIddkoKZJ09Jw+ywZUcvSY7Vb2eckBkA5rSzhuJkaHMicQdjS4ojAYIEmJrtcpMkMGAzQlBGYJEAmDkwEpkzEkCGBAooGjVaL2yGEaIJrwElAwgZCojDSZg5kkUVkwSIQhAQ0olRlWMjPZkZx2+uQrJiKQiCOYtdR00Pp2+rqt/TLA0Pp3fyt/TOS0WWlJjPxH1XWHE2/wCGh/0H/kuvqa9HtbaX3bepkNt3+GerOWojE5iLAjBpaNyfNYcTiBMQezYyvhbXrqVMS8QsSwsKxKpeJeIWIELVVJCtEbQsC4Su+8teWorSoMIwSY6oUlZkAzNFVPiYhdStiiLzopRV5zUz4i2sxM7sScDJJ7ABkmVUXHVdLOyBtDcq7bYgidPTcFtfm2K182wTj6P74mkDS09gN7jxPcH+3842do0Gvkn/ALOxMg7Saomnm/S/Jv3iflryKwaHQWW9xer6bHCfV5/VOgatNR3z0to+QAQFPs7B9cVqeI22drbV8lx97TGKYhcTua8vzWljsPhx9gzO743jTzaz3BdqFo1fFLbD27QOwVkj3nxlRYrlyd3oq3T4h5LnyOJPiR7AgegR2/By4d3aw8MMFP4sfnOfforV79bj17SR7xyidPa69xmT6LFROhTx7UJ2srfSRR94xNdSjofZZs3DJNxJEfAh7R605czfBnd/x1G/i6ZWPpDGfcVP5yg3D38HrJ8euSfduEBkdzYflqh/Z8Dx9limH/Pcf1v6rhQkE7Z4RQ3c1I9jgZ+8iWfg3cOwow9pB+8Qduzma87RPBcbVtjzjq0tcPY37LivBE6F3Cbx21H7BV/0kzJbQ69qOParLLA5p2IKwyYaeMXJG5vm0j6hATAJldIDGARqWbMOqDMYGkKxYk2TJhMrdBMkCiYpjgJkja7IQVE8iLLQi8ijMiCUTBM0GsRLpFKYI6WxJYYoRmMwWojUwwIFaxogVLjqqxJLzALCBVl7eZT6GjLasyqdPYe7Wx9inHvE6VXDbj8lR9Jh/tmaR2U3a9BgMJNOzL2bj45TXrVe64zUmUKZ3m0Cj+Jaq+oDB+/9pW/TL2Bn9uf92BF7YnZbRwIMP2r2s8C4X6CyuPXWewAk+Q5zZTwu5vk7R884/COc3f4mexFVV8s//JnsvZu12Pqxge6IXuWpmDwTB98v8qaPU6+iL/DaF/iWlz6CZH6ef5Ri64JyprVM9pbt9nL+qZgYDNBZO5tXCUQ/wGNj8QLd83Osqaixn77M3qPJf5YrEstK3iMudI4Fxc42epsn3UMmJYYSi0NFVFwVyoJMuSiq1y1lNJJOwfurgjdKhrJJKQrFTiSq1l7rFfokiSSTdQ91pc3QjnzWmjjF65xa32sP+rM9HwjiFj95s+xVX8hJJMWJa0DZd7gGNxL8XkdK4jTQuNelroipX7yq30lUwk4TQ3bUn2Rt/LEkkxBzhsV9EdBFK37Rgd5gH6rHreBacdlf47P3nlNRUA3Z+ckk6ETidza8R+0WFghLeyja3fYAfRZm7YQkkmheUViFJJIopH1ypJEEwxFskkLkUEiypJWmK01T0uj4RS3an4nH5GSSUzEgaLu/s5hoZ5nCVgeNNwD16roPwqleytftZb88wH6ndAXn8kASSTCSTdr6HHh4oW1GwN8gB9FwNfxe5ex/H0UP+kxPq7GOGdiPIsSPdJJNrGNy7L5VxfHYn97cztXZaOmY16WtNageEt1kklK6QAA0CS0JTLkhKjN0JaAZJIAnl2SXaCZJJc1cqTdNSHJJAVZHsikkkkVy/9k=",
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
