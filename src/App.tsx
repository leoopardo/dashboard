/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowUpOutlined } from "@ant-design/icons";
import PBLogo from "@assets/icon.png";
import { ConfigProvider, FloatButton, Layout, Spin } from "antd";
import { motion, useViewportScroll } from "framer-motion";
import { useEffect, useState } from "react";
import ReactGA from "react-ga4";
import { Toaster } from "react-hot-toast";
import { I18nextProvider, useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { PageHeader } from "./components/PageHeader/index.tsx";
import { SidebarNavigation } from "./components/SideBarNavigation/index.tsx";
import { ErrorProvider } from "./contexts/ErrorContext/index.tsx";
import { useMenu } from "./contexts/SidebarContext/index.tsx";
import { useTheme } from "./contexts/ThemeContext/index.tsx";
import i18n from "./i18n";
import { PrivateRoutes } from "./routes/private";
import { PublicRoutes } from "./routes/public";
import { useValidate } from "./services/siginIn/validate.tsx";
import { defaultTheme } from "./styles/defaultTheme/index.ts";
import { GlobalStyle } from "./styles/globalStyles.ts";
const Logo = import.meta.env.VITE_APP_ICON ?? PBLogo;

ReactGA.initialize(import.meta.env.VITE_APP_ANALYTICS_ID ?? "");

function App() {
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ maxWidth: "1250px" });
  const { isSidebarOpen } = useMenu();
  const { Content } = Layout;
  const [isIconSet, setIsIconSet] = useState<boolean>(false);
  const { isSuccess, validateError } = useValidate();
  const { theme } = useTheme();
  const { scrollYProgress } = useViewportScroll();
  const [showButton, setShowButton] = useState(false);

  scrollYProgress.onChange((v) => {
    setShowButton(document.documentElement.scrollHeight > 1300 && v > 0.3);
  }); // Ajuste este valor conforme necessário
  useEffect(() => {
    if (!isIconSet) {
      const link: any = document.querySelector("link[rel~='icon']");
      link.href = Logo;
      setIsIconSet(true);
    }
  }, [isIconSet]);

  const [element, setElement] = useState(
    <Layout
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img src={import.meta.env.VITE_APP_ICON} style={{ width: "7vw" }} />
      <Spin tip={t("messages.loading")} size="large" style={{ marginTop: -26 }}>
        <Layout className="content" />
      </Spin>
    </Layout>
  );

  useEffect(() => {
    async function signInStorage() {
      if (validateError) {
        setElement(<PublicRoutes />);
        return;
      }
      if (isSuccess) {
        setElement(<PrivateRoutes />);
      }
    }
    signInStorage();
  }, [isSuccess, validateError]);

  return (
    <I18nextProvider i18n={i18n} defaultNS={"translation"}>
      <ThemeProvider
        theme={
          theme === "dark"
            ? defaultTheme
            : { colors: { ...defaultTheme.colors, dark: "#DCDFE7" } }
        }
      >
        <BrowserRouter>
          <GlobalStyle />
          <ConfigProvider
            theme={{
              components: {
                Alert: {
                  colorError: "#000",
                  colorText: "#000",
                },
                Breadcrumb: {
                  colorFill: "#fff",
                  colorPrimary: "#000",
                  colorTextLabel: "#000",
                  lastItemColor: "#fff",
                  linkHoverColor: "#ffffff",
                },
                Menu: {
                  colorTextLightSolid:
                    theme === "dark"
                      ? "#fff"
                      : import.meta.env.VITE_APP_MENU_THEME === "dark"
                      ? "#fff"
                      : "#000",
                },
                Tooltip: {
                  colorTextLightSolid: theme === "dark" ? "#000" : "#fff",
                },
                DatePicker: {
                  controlItemBgActive:
                    theme === "dark"
                      ? "#303030"
                      : defaultTheme.colors.secondary,
                  padding: 0,
                  margin: 0,
                  paddingXS: 5,
                },
                FloatButton: { colorBgElevated: "#e4e4e4" },

                Button: {
                  colorTextLightSolid:
                    import.meta.env.VITE_APP_BUTTON === "dark"
                      ? "rgba(0, 0, 0, 0.88)"
                      : "#fff",
                },
                Select: {
                  controlItemBgActive:
                    theme === "dark"
                      ? "#303030"
                      : defaultTheme.colors.secondary,
                },
                Table: {
                  controlItemBgActive: defaultTheme.colors.secondary,
                  controlItemBgActiveHover: "#c0c0c09f",
                },
                Card: {
                  boxShadow:
                    theme === "dark"
                      ? "0px 4px 15.7px -3px rgba(0, 0, 0, 0.25)"
                      : "0px 4px 15.7px -3px rgba(0, 0, 0, 0.144)",
                  boxShadowSecondary:
                    theme === "dark"
                      ? "0px 4px 15.7px -3px rgba(0, 0, 0, 0.25)"
                      : "0px 4px 15.7px -3px rgba(0, 0, 0, 0.144)",
                  boxShadowTertiary:
                    theme === "dark"
                      ? "0px 4px 15.7px -3px rgba(0, 0, 0, 0.25)"
                      : "0px 4px 15.7px -3px rgba(0, 0, 0, 0.144)",
                },
                Layout: {
                  colorBgHeader: theme === "dark" ? "#222222" : "#fdfdfd",
                },
                Segmented: {
                  colorBgElevated: defaultTheme.colors.secondary,
                  colorBgLayout: theme === "dark" ? "#272727" : "#f1f1f1",
                },
                Badge: {
                  colorError: import.meta.env.VITE_APP_COLOR_SECONDARY,
                },
              },

              token: {
                colorPrimary: defaultTheme.colors.secondary,
                colorBgTextHover: defaultTheme.colors.secondary,
                colorBgContainer: theme === "dark" ? "#222222" : "#ffffff",

                colorBgLayout: theme === "dark" ? "#1a1a1a" : "#DCDFE7",
                colorText: theme === "dark" ? "#f5f5f5" : "rgba(0, 0, 0, 0.88)",
                colorTextHeading:
                  theme === "dark" ? "#f5f5f5" : "rgba(0, 0, 0, 0.88)",
                colorTextLightSolid:
                  theme === "dark" ? "#ffffff" : "rgba(0, 0, 0, 0.88)",
                colorTextBase:
                  theme === "dark" ? "#f5f5f5" : "rgba(0, 0, 0, 0.88)",
                colorTextLabel:
                  theme === "dark" ? "#f5f5f5" : "rgba(0, 0, 0, 0.88)",

                colorBgElevated: theme === "dark" ? "#1a1a1a" : "#ffffff",
                colorBorder: "#ACACAC",
                colorInfoBorder: "#ACACAC",
                colorBorderSecondary: theme === "dark" ? "#353535" : "#f5f5f5",
              },
            }}
          >
            <ErrorProvider>
              <Toaster
                position="top-center"
                data-test-id="toaster"
                containerClassName="toaster"
              />
              {isSuccess ? (
                <Layout>
                  <Layout>
                    <SidebarNavigation />

                    <div
                      style={{
                        marginLeft:
                          !isSuccess || isMobile
                            ? "0"
                            : isSidebarOpen
                            ? "256px"
                            : "90px",
                      }}
                    >
                      <PageHeader />

                      <Layout
                        style={{
                          padding: isMobile ? "4px" : "0 8px 8px",
                          minHeight: "100vh",
                          marginTop: "64px",
                          maxWidth: "98vw",
                          overflow: "hidden",
                        }}
                      >
                        <Content
                          style={{
                            padding: 0,
                            margin: 18,
                            marginTop: t(
                              `menus.${
                                location.pathname.split("/")[
                                  location.pathname.split("/").length - 1
                                ]
                              }`
                            ).includes("menus")
                              ? 10
                              : isMobile
                              ? 200
                              : 125,
                            borderRadius: 10,
                            background:
                              theme === "dark" ? "#222222 " : "#fdfdfd",
                            zIndex: 2,
                          }}
                        >
                          {element}
                          <motion.div
                            initial={{
                              opacity: !showButton ? 0 : 1,
                              display: !showButton ? "none" : "flex",
                            }}
                            animate={{
                              opacity: showButton ? 1 : 0,
                              display: showButton ? "flex" : "none",
                            }}
                            transition={{ duration: 0.5 }}
                          >
                            <FloatButton
                              data-test-id="float-button"
                              style={{ backgroundColor: "#b6b6b6" }}
                              tooltip={<div>{t("messages.scrool_top")}</div>}
                              icon={
                                <ArrowUpOutlined
                                  data-test-id="float-button"
                                  style={{ color: "#000" }}
                                />
                              }
                              onClick={() =>
                                window.scrollTo({
                                  top: 0,
                                  left: 0,
                                  behavior: "smooth",
                                })
                              }
                            />
                          </motion.div>
                        </Content>
                      </Layout>
                    </div>
                  </Layout>
                </Layout>
              ) : (
                element
              )}
            </ErrorProvider>
          </ConfigProvider>
        </BrowserRouter>
      </ThemeProvider>
    </I18nextProvider>
  );
}

export default App;
