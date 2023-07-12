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
const Logo = import.meta.env.VITE_APP_ICON;

function App() {
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ maxWidth: "900px" });
  const { isSidebarOpen } = useMenu();
  const { Content } = Layout;
  const [isIconSet, setIsIconSet] = useState<boolean>(false);
  const { isSuccess, validateError } = useValidate();

  useEffect(() => {
    if (!isIconSet) {
      const link: any = document.querySelector("link[rel~='icon']");
      link.href = Logo;
      setIsIconSet(true);
    }
  }, [isIconSet]);

  const [element, setElement] = useState(
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spin tip={t("messages.loading")} size="large">
        <div className="content" />
      </Spin>
    </div>
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
              token: {
                colorPrimary: defaultTheme.colors.secondary,
                colorBgTextHover: defaultTheme.colors.secondary,
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
                      style={{ padding: "0 24px 24px", minHeight: "93vh" }}
                    >
                      <Content
                        style={{
                          padding: 2,
                          margin: 0,
                          height: "100%",
                          background: "#fff",
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
