import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  CustButton,
  CustomCheckbox,
  HalfHover,
  LockIcon,
  RoundedLock,
} from "./styles";
import Logo from "../../../../assets/logo.png";
import { Grid } from "@mui/material";
import { useMediaQuery } from "react-responsive";
import { defaultTheme } from "../../../../styles/defaultTheme";
import { Button, Checkbox, Input } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  KeyOutlined,
  LoginOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { useTranslation } from "react-i18next";
import { api } from "../../../../config/api";

export const Login = () => {
  const { t } = useTranslation();
  const { signIn, token } = useAuth();
  document.title = "Login | Paybrokers";
  const isMobile = useMediaQuery({ maxWidth: "900px" });
  const navigate = useNavigate();
  const [rememerMe, setRememberMe] = useState(false);
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
  const [loginError, setLoginError] = useState<
    "" | "error" | "warning" | undefined
  >("");
  const [user, setUser] = useState<{ username: string; password: string }>({
    username: "",
    password: "",
  });

  useEffect(() => {
    setLoginError("");
  }, [user]);

  async function handleLogin(event: any) {
    event.preventDefault();
    try {
      setIsLoadingLogin(true);
      await signIn(user, rememerMe);
    } catch (error) {
      setLoginError("error");
    } finally {
      setIsLoadingLogin(false);
    }
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
            height: isMobile ? "0" : "150px",
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
          spacing={1}
        >
          <Grid item xs={8}>
            <Input
              status={loginError}
              size="large"
              value={user.username}
              onChange={(event) =>
                setUser((state) => ({ ...state, username: event.target.value }))
              }
              placeholder={`${t("login.user")}`}
              style={{ height: "50px" }}
              prefix={<UserOutlined />}
            />
          </Grid>
          <Grid item xs={8}>
            <Input.Password
              status={loginError}
              value={user.password}
              onChange={(event) =>
                setUser((state) => ({ ...state, password: event.target.value }))
              }
              size="large"
              placeholder={`${t("login.password")}`}
              style={{ height: "50px" }}
              prefix={<KeyOutlined />}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Grid>
          <Grid item xs={8}>
            <CustomCheckbox checked={rememerMe} onChange={onChange}>
             {t("login.remember_me")}
            </CustomCheckbox>
          </Grid>
        </Grid>

        <Grid
          container
          item
          xs={12}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            marginTop: "25px",
            maxHeight: "100px",
          }}
        >
          <Grid item xs={8}>
            <CustButton
              type="primary"
              icon={<LoginOutlined />}
              onClick={handleLogin}
              loading={isLoadingLogin}
            >
               {t("login.access")}
            </CustButton>
          </Grid>
          <Grid item xs={8}>
            <Button type="link">{t("login.forgot_password")}</Button>
          </Grid>
        </Grid>

        <Grid
          container
          item
          xs={12}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "25px",
            maxHeight: "200px",
          }}
        >
          <p style={{ opacity: 0.6 }}>Copyright © PayBrokers 2023.</p>
        </Grid>
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
