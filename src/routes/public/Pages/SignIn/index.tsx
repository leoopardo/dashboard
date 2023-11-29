import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  KeyOutlined,
  LoginOutlined,
  UserOutlined,
} from "@ant-design/icons";
import PbLogo from "@assets/logo.png";
import { Grid } from "@mui/material";
import { useTheme } from "@src/contexts/ThemeContext";
import { useToken } from "@src/services/siginIn/signIn";
import { Alert, Form, Input, Typography } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { motion } from "framer-motion";
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

const Logo = import.meta.env.VITE_APP_LOGO ?? PbLogo;

export const Login = () => {
  const { t } = useTranslation();
  // const { signIn, token } = useAuth();
  document.title = `Login | ${import.meta.env.VITE_APP_COMPANY_NAME}`;
  const submitRef = useRef<HTMLButtonElement>(null);
  const isMobile = useMediaQuery({ maxWidth: "900px" });
  const [rememerMe, setRememberMe] = useState(true);
  const [user, setUser] = useState<{ username: string; password: string }>({
    username: "",
    password: "",
  });
  const { theme } = useTheme();

  const { Login, isValidateFetching, validateError, LoginError, isLoading } =
    useToken(user, rememerMe);

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
          background:
            theme === "dark"
              ? "rgba(0, 0, 0, 0.88)"
              : isMobile
              ? `linear-gradient(180deg, ${defaultTheme.colors.primary} 0%, ${defaultTheme.colors.secondary} 129.95%)`
              : `linear-gradient(90deg, ${defaultTheme.colors.primary} 0%, ${defaultTheme.colors.secondary} 189.05%)`,
        }}
      >
        <motion.img
          data-test-id="img-logo"
          src={Logo}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
            transition: {
              duration: 1,
            },
          }}
          style={{ width: "80%", maxWidth: "350px" }}
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
          backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff",
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
            <LockIcon data-test-id="lock-icon" />
          </RoundedLock>
          {isMobile ? (
            <Typography.Title
              data-test-id="sign-in-text"
              level={2}
              style={{ fontWeight: 500 }}
            >
              {t("login.sign_in")}
            </Typography.Title>
          ) : (
            <Typography.Title
              data-test-id="sign-in-text"
              level={2}
              style={{ fontWeight: 500 }}
            >
              {t("login.sign_in")}
            </Typography.Title>
          )}
        </Grid>
        <Form
          data-test-id="sign-in-form"
          layout="vertical"
          onFinish={handleLogin}
        >
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
                data-test-id="form-item-username"
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
                  data-test-id="input-username"
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
                  prefix={<UserOutlined data-test-id="icon-user" />}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={8}>
              <Form.Item
                data-test-id="form-item-password"
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
                  data-test-id="input-password"
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
                  prefix={<KeyOutlined data-test-id="icon-key" />}
                  iconRender={(visible) =>
                    visible ? (
                      <EyeTwoTone data-test-id="icon-eye" />
                    ) : (
                      <EyeInvisibleOutlined data-test-id="icon-invisible-eye" />
                    )
                  }
                />
              </Form.Item>
            </Grid>
            {validateError && LoginError && (
              <Grid item xs={8}>
                <Alert
                  data-test-id="alert-error"
                  message={t("error.password_or_username")}
                  type="error"
                  closable
                />
              </Grid>
            )}
            <Grid item xs={8}>
              <Form.Item>
                <CustomCheckbox
                  data-test-id="remember-me-checkbox"
                  checked={rememerMe}
                  onChange={onChange}
                >
                  {t("login.remember_me")}
                </CustomCheckbox>
              </Form.Item>
            </Grid>
            <Grid
              item
              xs={8}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <Form.Item>
                <button
                  type="submit"
                  ref={submitRef}
                  style={{ display: "none" }}
                >
                  Submit
                </button>
                <CustButton
                  data-test-id="button-submit"
                  type="primary"
                  icon={<LoginOutlined />}
                  onClick={() => submitRef.current?.click()}
                  loading={isValidateFetching || isLoading}
                >
                  {t("login.access")}
                </CustButton>
              </Form.Item>
              <Typography.Link
                data-test-id="forgot-password-link"
                style={{ textAlign: "center", width: "100%", marginTop: -16 }}
                href="/forgot_my_password"
              >
                {t("messages.forgot_password")}
              </Typography.Link>
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
              <Typography
                style={{ opacity: 0.6 }}
                data-test-id="copyright-text"
              >
                Copyright ©{" "}
                <Typography.Link
                  href="https://paybrokers.com.br/"
                  target="_blank"
                  style={{
                    color: theme === "dark" ? "#fff" : "#4a4a4a",
                    textDecoration: "underline",
                  }}
                >
                  PayBrokers
                </Typography.Link>{" "}
                2023.
              </Typography>
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
