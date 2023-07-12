import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  KeyOutlined,
  LoginOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Grid } from "@mui/material";
import { useToken } from "@src/services/siginIn/signIn";
import { Alert, Form, Input } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { defaultTheme } from "../../../../styles/defaultTheme";
import {
  CustButton,
  CustomCheckbox,
  HalfHover,
  LockIcon,
  RoundedLock,
} from "./styles";

const Logo = import.meta.env.VITE_APP_LOGO;

export const Login = () => {
  const { t } = useTranslation();
  // const { signIn, token } = useAuth();
  document.title = `Login | ${import.meta.env.VITE_APP_COMPANY_NAME}`;
  const submitRef = useRef<HTMLButtonElement>(null);
  const isMobile = useMediaQuery({ maxWidth: "900px" });
  const [rememerMe, setRememberMe] = useState(false);
  const [user, setUser] = useState<{ username: string; password: string }>({
    username: "",
    password: "",
  });

  const { Login, isValidateFetching, validateError, LoginError } = useToken(
    user,
    rememerMe
  );

  async function handleLogin() {
    Login();
  }

  const onChange = (e: CheckboxChangeEvent) => {
    setRememberMe(e.target.checked);
  };

  return (
    <Grid
      container
      style={{ width: "100%", display: "flex", flexDirection: "row" }}
    >
      <HalfHover
        item
        xs={12}
        md={8}
        lg={8}
        style={{
          height: isMobile ? "30vh" : "100vh",
          background: isMobile
            ? `linear-gradient(180deg, ${defaultTheme.colors.primary} 0%, ${defaultTheme.colors.secondary} 129.95%)`
            : `linear-gradient(90deg, ${defaultTheme.colors.primary} 0%, ${defaultTheme.colors.secondary} 189.05%)`,
        }}
      >
        <img
          src={Logo}
          alt="logo"
          style={{ width: "80%", maxWidth: "400px" }}
        />
      </HalfHover>
      <Grid
        item
        xs={12}
        md={4}
        lg={4}
        style={{
          width: "30vw",
          height: isMobile ? "70vh" : "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Grid
          style={{
            height: isMobile ? "0" : "100px",
            marginTop: isMobile ? "-18px" : 0,
          }}
        />
        <Grid
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <RoundedLock
            sx={{
              bgcolor: isMobile ? "#469E9F" : defaultTheme.colors.secondary,
              marginBottom: "5px",
            }}
          >
            <LockIcon />
          </RoundedLock>
          {isMobile ? (
            <h2 style={{ fontWeight: 500 }}>{t("login.sign_in")}</h2>
          ) : (
            <h1 style={{ fontWeight: 500 }}>{t("login.sign_in")}</h1>
          )}
        </Grid>
        <Form layout="vertical" onFinish={handleLogin}>
          <Grid
            container
            item
            xs={12}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              marginTop: "25px",
              maxHeight: "200px",
            }}
          >
            <Grid item xs={8}>
              <Form.Item
                label={`${t("login.user")}`}
                name="user"
                rules={[
                  {
                    required: true,
                    message:
                      t("input.required", { field: t("input.user") }) || "",
                  },
                ]}
              >
                <Input
                  status={validateError && LoginError ? "error" : undefined}
                  size="large"
                  value={user.username}
                  onChange={(event) =>
                    setUser((state) => ({
                      ...state,
                      username: event.target.value,
                    }))
                  }
                  placeholder={`${t("login.user")}123`}
                  style={{ height: "50px" }}
                  prefix={<UserOutlined />}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={8}>
              <Form.Item
                label={`${t("login.password")}`}
                name="password"
                rules={[
                  {
                    required: true,
                    message:
                      t("input.required(a)", { field: t("input.password") }) ||
                      "",
                  },
                ]}
              >
                <Input.Password
                  status={validateError && LoginError ? "error" : undefined}
                  value={user.password}
                  onChange={(event) =>
                    setUser((state) => ({
                      ...state,
                      password: event.target.value,
                    }))
                  }
                  size="large"
                  placeholder="*********"
                  style={{ height: "50px" }}
                  prefix={<KeyOutlined />}
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>
            </Grid>
            {validateError && LoginError && (
              <Grid item xs={8}>
                <Alert
                  message={t("error.password_or_username")}
                  type="error"
                  closable
                />
              </Grid>
            )}
            <Grid item xs={8}>
              <Form.Item>
                <CustomCheckbox checked={rememerMe} onChange={onChange}>
                  {t("login.remember_me")}
                </CustomCheckbox>
              </Form.Item>
            </Grid>
            <Grid item xs={8}>
              <Form.Item>
                <button
                  type="submit"
                  ref={submitRef}
                  style={{ display: "none" }}
                >
                  Submit
                </button>
                <CustButton
                  type="primary"
                  icon={<LoginOutlined />}
                  onClick={() => submitRef.current?.click()}
                  loading={isValidateFetching}
                >
                  {t("login.access")}
                </CustButton>
              </Form.Item>
            </Grid>
            <Grid
              container
              item
              xs={12}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "50px",
                maxHeight: "200px",
              }}
            >
              <p style={{ opacity: 0.6 }}>
                Copyright ©{" "}
                <a
                  href="https://paybrokers.com.br/"
                  target="_blank"
                  style={{ color: "#4a4a4a", textDecoration: "underline" }}
                >
                  PayBrokers
                </a>{" "}
                2023.
              </p>
            </Grid>
          </Grid>
        </Form>
      </Grid>

      {/* <form
    style={{ display: "flex", flexDirection: "column" }}
    onSubmit={handleLogin}
  >
    <label htmlFor="username">Username</label>
    <input
      id="username"
      name="username"
      value={user.username}
      onChange={handleChange}
    />
    <label htmlFor="password">Password</label>
    <input id="password" name="password" onChange={handleChange} />

    <button style={{ marginTop: "5px" }} type="submit">
      Login
    </button>
  </form> */}
    </Grid>
  );
};
