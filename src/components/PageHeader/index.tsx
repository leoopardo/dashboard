/* eslint-disable no-unexpected-multiline */
/* eslint-disable no-empty-pattern */
import {
  DownOutlined,
  LogoutOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useErrorContext } from "@src/contexts/ErrorContext";
import { useMenu } from "@src/contexts/SidebarContext";
import { useTheme } from "@src/contexts/ThemeContext";
import { useGetSelf } from "@src/services/getSelf";
import { queryClient } from "@src/services/queryClient";
import { useValidate } from "@src/services/siginIn/validate";
import { ValidateInterface } from "@src/services/types/validate.interface";
import {
  Avatar,
  Col,
  Divider,
  Dropdown,
  MenuProps,
  Radio,
  Row,
  Space,
  Typography,
  theme as t,
} from "antd";
import React, { useState } from "react";
import ReactGA from "react-ga4";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import secureLocalStorage from "react-secure-storage";
import brazil from "../../assets/brazil-.png";
import eua from "../../assets/united-states.png";
import { defaultTheme } from "../../styles/defaultTheme";
import { BreadcrumbComponent } from "../Breadcrumb";
import { ValidateToken } from "../ValidateToken";
import { EditSelfModal } from "./EditSelf";
import { useLocation } from "react-router-dom";
const { useToken } = t;

export const PageHeader = () => {
  const location = useLocation();
  const user = queryClient.getQueryData("validate") as ValidateInterface;
  const { isSidebarOpen } = useMenu();
  const isMobile = useMediaQuery({ maxWidth: "1250px" });
  const { t, i18n } = useTranslation();
  const { responseValidate } = useValidate();
  const { resetErrors } = useErrorContext();
  const translation = useTranslation().i18n.language;
  const { token } = useToken();
  const [isEditUserModalOpen, setIsEditUserModalOpen] =
    useState<boolean>(false);
  const [isValidateCellphoneModalOpen, setIsValidateCellphoneModalOpen] =
    useState<boolean>(false);
  const { setTheme, theme } = useTheme();
  const { refetchSelf } = useGetSelf();
  const [tokenState, setTokenState] = useState<string>("");

  const contentStyle = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };

  const menuStyle = {
    boxShadow: "none",
  };

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

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

  const userItems: MenuProps["items"] = user.phone_validated
    ? [
        {
          type: "divider",
        },
        {
          key: "en",
          label: t("menus.edit_user"),
          icon: <UserOutlined />,
          onClick: () => {
            setIsEditUserModalOpen(true);
          },
        },
        {
          key: "logout",
          label: t("menus.logout"),
          icon: <LogoutOutlined style={{ marginRight: 8, color: "red" }} />,
          onClick: () => {
            secureLocalStorage.removeItem("token");
            sessionStorage.removeItem("token");
            queryClient.refetchQueries(["validate"]);
            resetErrors();
          },
        },
      ]
    : [
        {
          type: "divider",
        },
        {
          key: "en",
          label: t("menus.edit_user"),
          icon: <UserOutlined />,
          onClick: () => {
            setIsEditUserModalOpen(true);
          },
        },
        {
          key: "validate_phone",
          label: t("modal.validate_phone_number"),
          icon: (
            <PhoneOutlined
              style={{ marginRight: 8, color: defaultTheme.colors.info }}
            />
          ),
          onClick: () => {
            setIsValidateCellphoneModalOpen(true);
          },
        },
        {
          key: "logout",
          label: t("menus.logout"),
          icon: <LogoutOutlined style={{ marginRight: 8, color: "red" }} />,
          onClick: () => {
            secureLocalStorage.removeItem("token");
            sessionStorage.removeItem("token");
            queryClient.refetchQueries(["validate"]);
            resetErrors();
          },
        },
      ];

  return !isMobile ? (
    <Row
      gutter={[8, 8]}
      style={{
        width: isSidebarOpen ? "calc(100vw - 246px)" : "calc(100vw - 80px)",
        height: "45vh",
        position: "fixed",
        backgroundColor: import.meta.env.VITE_APP_COLOR_PRIMARY,
        display: "flex",
        alignItems: "start",
        marginLeft: -10,
      }}
    >
      <Col span={24}>
        <Row>
          <Col
            xs={{ span: 24 }}
            md={{ span: 20 }}
            lg={{ span: 20 }}
            style={{ paddingLeft: "35px" }}
          >
            <BreadcrumbComponent />
          </Col>

          <Col
            xs={{ span: 24 }}
            md={{ span: 4 }}
            lg={{ span: 4 }}
            style={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
              paddingRight: "2.5%",
            }}
          >
            <Dropdown menu={{ items }} arrow placement="bottomRight">
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  {" "}
                  {translation === "pt-BR" || translation === "ptbr" ? (
                    <Avatar
                      style={{ height: "25px", width: "25px" }}
                      src={brazil}
                    />
                  ) : (
                    <Avatar
                      style={{ height: "25px", width: "25px" }}
                      src={eua}
                    />
                  )}
                  {t("menus.language")}
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
            <Dropdown
              menu={{ items: userItems }}
              arrow
              placement="bottomRight"
              onOpenChange={() => refetchSelf()}
              dropdownRender={(menu) => (
                <div style={contentStyle}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                      width: "250px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "250px",
                        marginTop: "10px",
                      }}
                    >
                      <Avatar
                        style={{
                          backgroundColor: defaultTheme.colors.secondary,
                          marginRight: "5px",
                        }}
                      >
                        {responseValidate?.name?.toLocaleUpperCase()[0]}
                      </Avatar>
                      {responseValidate?.name}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        marginTop: "10px",
                        fontSize: "12px",
                      }}
                    >
                      {t("table.last_signin_date")}:{" "}
                      {`${new Date(
                        `${responseValidate?.last_signin_date}`
                      ).toLocaleDateString()} ${new Date(
                        `${responseValidate?.last_signin_date}`
                      ).toLocaleTimeString()}`}
                    </div>
                  </div>
                  {React.cloneElement(menu as React.ReactElement, {
                    style: menuStyle,
                  })}
                  <div style={{ padding: 5 }}>
                    <Radio.Group
                      defaultValue={theme}
                      buttonStyle="solid"
                      value={theme}
                      onChange={(e) => {
                        setTheme(e.target.value);
                        ReactGA.event({
                          category: "Theme",
                          action: e.target.value,
                        });
                      }}
                    >
                      <Radio.Button value="light">
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {t("buttons.light")}{" "}
                          <LightModeIcon style={{ marginLeft: 8 }} />
                        </div>
                      </Radio.Button>
                      <Radio.Button value="dark">
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {t("buttons.dark")}{" "}
                          <DarkModeIcon style={{ marginLeft: 8 }} />{" "}
                        </div>
                      </Radio.Button>
                    </Radio.Group>
                  </div>
                </div>
              )}
            >
              <Avatar
                style={{
                  backgroundColor: defaultTheme.colors.secondary,
                  minHeight: "40px",
                  minWidth: "40px",
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "20px",
                }}
              >
                {responseValidate?.name?.toLocaleUpperCase()[0]}
              </Avatar>
            </Dropdown>
          </Col>
          <Col span={24}>
            <Divider
              style={{ backgroundColor: "#ffffff29", margin: 0, marginTop: 8 }}
            />
          </Col>
          {!t(
            `menus.${
              location.pathname.split("/")[
                location.pathname.split("/").length - 1
              ]
            }`
          ).includes("menus") &&
            !["details", "update", "configs"].includes(
              location.pathname.split("/")[
                location.pathname.split("/").length - 1
              ]
            ) && (
              <Col
                span={24}
                style={{ margin: 32, marginTop: 16, marginBottom: 0 }}
              >
                <Typography.Title level={1} style={{ color: "#ffffff" }}>
                  {location.pathname
                    .split("/")
                    [location.pathname.split("/").length - 1].includes(
                      "reports"
                    )
                    ? t("menus.reports_page_title", {
                      page: t(
                        `menus.${
                          location.pathname.split("/")[
                            location.pathname.split("/").length - 1
                          ]
                        }`
                      ),
                    })
                  : t(
                      `menus.${
                        location.pathname.split("/")[
                          location.pathname.split("/").length - 1
                        ]
                      }`
                    )}
                </Typography.Title>
              </Col>
            )}
          {!t(
            `menus.${
              location.pathname.split("/")[
                location.pathname.split("/").length - 1
              ]
            }`
          ).includes("menus") &&
            ["details", "update", "configs"].includes(
              location.pathname.split("/")[
                location.pathname.split("/").length - 1
              ]
            ) && (
              <Col
                span={24}
                style={{ margin: 32, marginTop: 16, marginBottom: 0 }}
              >
                <Typography.Title level={1} style={{ color: "#ffffff" }}>
                  {`${t(
                    `menus.${
                      location.pathname.split("/")[
                        location.pathname.split("/").length - 1
                      ]
                    }`
                  )} ${t(
                    `menus.${
                      location.pathname.split("/")[
                        location.pathname.split("/").length - 2
                      ]
                    }`
                  ).toLocaleLowerCase()}`}
                </Typography.Title>
              </Col>
            )}
          {!t(
            `menus_description.${
              location.pathname.split("/")[
                location.pathname.split("/").length - 1
              ]
            }`
          ).includes("menus_description") &&
            !["details", "update", "configs"].includes(
              location.pathname.split("/")[
                location.pathname.split("/").length - 1
              ]
            ) && (
              <Col span={24} style={{ margin: 32, marginTop: -8 }}>
                <Typography.Title
                  level={5}
                  style={{ color: "#ffffff", fontWeight: 300 }}
                >
                  {t(
                    `menus_description.${
                      location.pathname.split("/")[
                        location.pathname.split("/").length - 1
                      ]
                    }`
                  )}
                </Typography.Title>
              </Col>
            )}

          {!t(
            `menus_description.${
              location.pathname.split("/")[
                location.pathname.split("/").length - 1
              ]
            }_${
              location.pathname.split("/")[
                location.pathname.split("/").length - 2
              ]
            }`
          ).includes("menus_description") &&
            ["details", "update", "configs"].includes(
              location.pathname.split("/")[
                location.pathname.split("/").length - 1
              ]
            ) && (
              <Col span={24} style={{ margin: 32, marginTop: -8 }}>
                <Typography.Title
                  level={5}
                  style={{ color: "#ffffff", fontWeight: 300 }}
                >
                  {t(
                    `menus_description.${
                      location.pathname.split("/")[
                        location.pathname.split("/").length - 1
                      ]
                    }_${
                      location.pathname.split("/")[
                        location.pathname.split("/").length - 2
                      ]
                    }`
                  )}
                </Typography.Title>
              </Col>
            )}
        </Row>
      </Col>

      {isEditUserModalOpen && (
        <EditSelfModal
          open={isEditUserModalOpen}
          setOpen={setIsEditUserModalOpen}
          self={responseValidate}
        />
      )}
      {isValidateCellphoneModalOpen && (
        <ValidateToken
          action="USER_UPDATE"
          editSelf
          body={{}}
          open={isValidateCellphoneModalOpen}
          setIsOpen={setIsValidateCellphoneModalOpen}
          setTokenState={setTokenState}
          tokenState={tokenState}
          submit={() => {
            return;
          }}
        />
      )}
    </Row>
  ) : (
    <Row
      gutter={[8, 8]}
      style={{
        width: "100vw",
        maxWidth: "100vw",
        height: "60vh",
        position: "fixed",
        backgroundColor: import.meta.env.VITE_APP_COLOR_PRIMARY,
        display: "flex",
        alignItems: "start",
        overflow: "hidden",
        paddingRight: "24px",
      }}
    >
      <Col
        span={24}
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingTop: "5px",
          paddingBottom: "15px",
        }}
      >
        <Dropdown menu={{ items }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              {translation === "pt-BR" || translation === "ptbr" ? (
                <Avatar
                  style={{ height: "25px", width: "25px" }}
                  src={brazil}
                />
              ) : (
                <Avatar style={{ height: "25px", width: "25px" }} src={eua} />
              )}
              {t("menus.language")}
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
        <Dropdown
          menu={{ items: userItems }}
          arrow
          placement="bottomRight"
          onOpenChange={() => refetchSelf()}
          dropdownRender={(menu) => (
            <div style={contentStyle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  width: "250px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "250px",
                    marginTop: "10px",
                  }}
                >
                  <Avatar
                    style={{
                      backgroundColor: defaultTheme.colors.secondary,
                      marginRight: "5px",
                    }}
                  >
                    {responseValidate?.name?.toLocaleUpperCase()[0]}
                  </Avatar>
                  {responseValidate?.name}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    marginTop: "10px",
                    fontSize: "12px",
                  }}
                >
                  {t("table.last_signin_date")}:{" "}
                  {`${new Date(
                    `${responseValidate?.last_signin_date}`
                  ).toLocaleDateString()} ${new Date(
                    `${responseValidate?.last_signin_date}`
                  ).toLocaleTimeString()}`}
                </div>
              </div>
              {React.cloneElement(menu as React.ReactElement, {
                style: menuStyle,
              })}
              <div style={{ padding: 5 }}>
                <Radio.Group
                  defaultValue={theme}
                  buttonStyle="solid"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                >
                  <Radio.Button value="light">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {t("buttons.light")}{" "}
                      <LightModeIcon style={{ marginLeft: 8 }} />
                    </div>
                  </Radio.Button>
                  <Radio.Button value="dark">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {t("buttons.dark")}{" "}
                      <DarkModeIcon style={{ marginLeft: 8 }} />{" "}
                    </div>
                  </Radio.Button>
                </Radio.Group>
              </div>
            </div>
          )}
        >
          <Avatar
            style={{
              backgroundColor: defaultTheme.colors.secondary,
              minHeight: "40px",
              minWidth: "40px",
              display: "flex",
              alignItems: "center",
              marginLeft: "20px",
            }}
          >
            {responseValidate?.name?.toLocaleUpperCase()[0]}
          </Avatar>
        </Dropdown>
      </Col>

      <Col
        span={24}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          marginTop: -110,
        }}
      >
        <BreadcrumbComponent />
      </Col>
      <div
        style={{
          marginTop: -150,
        }}
      >
        {!t(
          `menus.${
            location.pathname.split("/")[
              location.pathname.split("/").length - 1
            ]
          }`
        ).includes("menus") &&
          !["details", "update", "configs"].includes(
            location.pathname.split("/")[
              location.pathname.split("/").length - 1
            ]
          ) && (
            <Col
              span={24}
              style={{ margin: 32, marginTop: 16, marginBottom: 0 }}
            >
              <Typography.Title level={3} style={{ color: "#ffffff" }}>
                {location.pathname
                  .split("/")
                  [location.pathname.split("/").length - 1].includes("reports")
                  ? t("menus.reports_page_title", {
                    page: t(
                      `menus.${
                        location.pathname.split("/")[
                          location.pathname.split("/").length - 1
                        ]
                      }`
                    ),
                  })
                : t(
                    `menus.${
                      location.pathname.split("/")[
                        location.pathname.split("/").length - 1
                      ]
                    }`
                  )}
              </Typography.Title>
            </Col>
          )}
        {!t(
          `menus.${
            location.pathname.split("/")[
              location.pathname.split("/").length - 1
            ]
          }`
        ).includes("menus") &&
          ["details", "update", "configs"].includes(
            location.pathname.split("/")[
              location.pathname.split("/").length - 1
            ]
          ) && (
            <Col
              span={24}
              style={{ margin: 32, marginTop: 16, marginBottom: 0 }}
            >
              <Typography.Title level={3} style={{ color: "#ffffff" }}>
                {`${t(
                  `menus.${
                    location.pathname.split("/")[
                      location.pathname.split("/").length - 1
                    ]
                  }`
                )} ${t(
                  `menus.${
                    location.pathname.split("/")[
                      location.pathname.split("/").length - 2
                    ]
                  }`
                ).toLocaleLowerCase()}`}
              </Typography.Title>
            </Col>
          )}
        {!t(
          `menus_description.${
            location.pathname.split("/")[
              location.pathname.split("/").length - 1
            ]
          }`
        ).includes("menus_description") &&
          !["details", "update", "configs"].includes(
            location.pathname.split("/")[
              location.pathname.split("/").length - 1
            ]
          ) && (
            <Col span={24} style={{ margin: 32, marginTop: -6 }}>
              <Typography.Text
                style={{ color: "#ffffff",  }}
              >
                {t(
                  `menus_description.${
                    location.pathname.split("/")[
                      location.pathname.split("/").length - 1
                    ]
                  }`
                )}
              </Typography.Text>
            </Col>
          )}

        {!t(
          `menus_description.${
            location.pathname.split("/")[
              location.pathname.split("/").length - 1
            ]
          }_${
            location.pathname.split("/")[
              location.pathname.split("/").length - 2
            ]
          }`
        ).includes("menus_description") &&
          ["details", "update", "configs"].includes(
            location.pathname.split("/")[
              location.pathname.split("/").length - 1
            ]
          ) && (
            <Col span={24} style={{ margin: 32, marginTop: -6 }}>
              <Typography.Text
                style={{ color: "#ffffff", fontWeight: 300 }}
              >
                {t(
                  `menus_description.${
                    location.pathname.split("/")[
                      location.pathname.split("/").length - 1
                    ]
                  }_${
                    location.pathname.split("/")[
                      location.pathname.split("/").length - 2
                    ]
                  }`
                )}
              </Typography.Text>
            </Col>
          )}
      </div>

      <EditSelfModal
        open={isEditUserModalOpen}
        setOpen={setIsEditUserModalOpen}
        self={responseValidate}
      />

      {isValidateCellphoneModalOpen && (
        <ValidateToken
          action="USER_UPDATE"
          body={{}}
          open={isValidateCellphoneModalOpen}
          setIsOpen={setIsValidateCellphoneModalOpen}
          setTokenState={setTokenState}
          tokenState={tokenState}
          submit={() => {
            return;
          }}
        />
      )}
    </Row>
  );
};
