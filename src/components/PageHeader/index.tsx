/* eslint-disable no-empty-pattern */
import { DownOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import secureLocalStorage from "react-secure-storage";
import { queryClient } from "@src/services/queryClient";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { Grid } from "@mui/material";
import { useTheme } from "@src/contexts/ThemeContext";
import { useGetSelf } from "@src/services/getSelf";
import { useValidate } from "@src/services/siginIn/validate";
import {
  Avatar,
  Button,
  Dropdown,
  MenuProps,
  Radio,
  Space,
  theme as t,
} from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import brazil from "../../assets/brazil-.png";
import eua from "../../assets/united-states.png";
import { useErrorContext } from "@src/contexts/ErrorContext";
import { defaultTheme } from "../../styles/defaultTheme";
import { BreadcrumbComponent } from "../Breadcrumb";
import { EditSelfModal } from "./EditSelf";
const { useToken } = t;

export const PageHeader = () => {
  const isMobile = useMediaQuery({ maxWidth: "950px" });
  const { t, i18n } = useTranslation();
  const { responseValidate } = useValidate();
  const {resetErrors} = useErrorContext()
  const translation = useTranslation().i18n.language;
  const { token } = useToken();
  const [isEditUserModalOpen, setIsEditUserModalOpen] =
    useState<boolean>(false);
  const { setTheme, theme } = useTheme();
  const { refetchSelf } = useGetSelf();

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

  const userItems: MenuProps["items"] = [
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
      icon:  <LogoutOutlined style={{ marginRight: 8, color: "red" }} />,
      onClick: () => {
        secureLocalStorage.removeItem("token");
        sessionStorage.removeItem("token");
        queryClient.refetchQueries(["validate"]);
        resetErrors()
      },
    },
  ];

  return !isMobile ? (
    <Grid
      container
      style={{
        width: "100%",
      }}
    >
      <Grid item xs={12} md={9} lg={9} style={{ paddingLeft: "25px" }}>
        <BreadcrumbComponent />
      </Grid>

      <Grid
        item
        xs={12}
        md={3}
        lg={3}
        style={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          paddingRight: "20px",
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
                    {responseValidate?.name.toLocaleUpperCase()[0]}
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
            {responseValidate?.name.toLocaleUpperCase()[0]}
          </Avatar>
        </Dropdown>
      </Grid>

      {isEditUserModalOpen && (
        <EditSelfModal
          open={isEditUserModalOpen}
          setOpen={setIsEditUserModalOpen}
          self={responseValidate}
        />
      )}
    </Grid>
  ) : (
    <Grid
      container
      style={{
        width: "97vw",
        display: isMobile ? "inherit" : "none",
      }}
    >
      <Grid
        item
        xs={12}
        md={12}
        lg={2}
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
                    {responseValidate?.name.toLocaleUpperCase()[0]}
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
            {responseValidate?.name.toLocaleUpperCase()[0]}
          </Avatar>
        </Dropdown>
      </Grid>

      <Grid
        item
        xs={12}
        md={10}
        lg={10}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <BreadcrumbComponent />
      </Grid>

      <EditSelfModal
        open={isEditUserModalOpen}
        setOpen={setIsEditUserModalOpen}
        self={responseValidate}
      />
    </Grid>
  );
};
