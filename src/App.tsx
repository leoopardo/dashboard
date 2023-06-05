import { useState, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import { PublicRoutes } from "./routes/public";
import { PrivateRoutes } from "./routes/private";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "./styles/globalStyles.ts";
import { defaultTheme } from "./styles/defaultTheme/index.ts";
import { ConfigProvider, Spin, Layout } from "antd";
import { SidebarNavigation } from "./components/SideBarNavigation/index.tsx";
import { useMenu } from "./contexts/SidebarContext/index.tsx";
import { useMediaQuery } from "react-responsive";
import { PageHeader } from "./components/PageHeader/index.tsx";

function App() {
  const { signInByStorage, signOut, token, user } = useAuth();
  const isMobile = useMediaQuery({ maxWidth: "900px" });
  const { isSidebarOpen } = useMenu();
  const { Content } = Layout;

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
      <Spin tip="Loading" size="large">
        <div className="content" />
      </Spin>
    </div>
  );

  useEffect(() => {
    async function signInStorage() {
      let success = false;
      success = await signInByStorage();
      console.log(success);

      if (!success) {
        signOut;
        setElement(<PublicRoutes route="/login" />);
        return;
      }

      setElement(<PrivateRoutes />);
    }
    signInStorage();
  }, [token]);

  return (
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
          {user ? (
            <Layout>
              <Layout>
                <SidebarNavigation />

                <div
                  style={{
                    marginLeft:
                      !user || isMobile
                        ? "0"
                        : isSidebarOpen
                        ? "256px"
                        : "90px",
                  }}
                >
                  <PageHeader />
                  <Layout style={{ padding: "0 24px 24px", height: "100vh" }}>
                    <Content
                      style={{
                        padding: 24,
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
  );
}

export default App;
