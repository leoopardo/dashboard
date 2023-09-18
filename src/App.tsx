/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConfigProvider, Layout, Spin } from "antd";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { I18nextProvider, useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { PageHeader } from "./components/PageHeader/index.tsx";
import { SidebarNavigation } from "./components/SideBarNavigation/index.tsx";
import { useMenu } from "./contexts/SidebarContext/index.tsx";
import i18n from "./i18n";
import { PrivateRoutes } from "./routes/private";
import { PublicRoutes } from "./routes/public";
import { useValidate } from "./services/siginIn/validate.tsx";
import { defaultTheme } from "./styles/defaultTheme/index.ts";
import { GlobalStyle } from "./styles/globalStyles.ts";
import {
  StyledThemeProvider,
  useTheme,
} from "./contexts/ThemeContext/index.tsx";
const Logo = import.meta.env.VITE_APP_ICON;

function App() {
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ maxWidth: "900px" });
  const { isSidebarOpen } = useMenu();
  const { Content } = Layout;
  const [isIconSet, setIsIconSet] = useState<boolean>(false);
  const { isSuccess, validateError } = useValidate();
  const { theme } = useTheme();

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
      <Spin tip={t("messages.loading")} size="large">
        <Layout className="content" />
      </Spin>
    </Layout>
  );

  useEffect(() => {
    async function signInStorage() {
      if (validateError) {
        setElement(<PublicRoutes route="/login" />);
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
      <ThemeProvider theme={defaultTheme}>
        <BrowserRouter>
          <GlobalStyle />
          <ConfigProvider
            theme={{
              components: {
                Menu: {
                  colorTextLightSolid:
                    theme === "dark"
                      ? "#fff"
                      : import.meta.env.VITE_APP_MENU_THEME === "dark"
                      ? "#fff"
                      : "#000",
                  subMenuItemBg: "#000",
                },
                Tooltip: {
                  colorTextLightSolid: theme === "dark" ? "#000" : "#fff",
                },
                DatePicker: {
                  controlItemBgActive: theme === "dark" ? "#303030" : defaultTheme.colors.secondary
                },
                Button: {
                  colorTextLightSolid:
                  "rgba(0, 0, 0, 0.88)",
                }
              },
              token: {
                colorPrimary: defaultTheme.colors.secondary,
                colorBgTextHover: defaultTheme.colors.secondary,
                colorBgContainer: theme === "dark" ? "#1a1a1a" : "#ffffff",
                colorBgLayout: theme === "dark" ? "#1a1a1a" : "#f5f5f5",
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
            <Toaster position="top-center" />
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
                        padding: "0 24px 24px",
                        minHeight: "92vh",
                      }}
                    >
                      <Content
                        style={{
                          padding: 2,
                          margin: 0,
                          height: "100%",
                          background: theme === "dark" ? "#222222 " : "#ffffff",
                        }}
                      >
                        {element}
                      </Content>
                    </Layout>
                  </div>
                </Layout>
              </Layout>
            ) : (
              element
            )}
          </ConfigProvider>
        </BrowserRouter>
      </ThemeProvider>
    </I18nextProvider>
  );
}

export default App;
