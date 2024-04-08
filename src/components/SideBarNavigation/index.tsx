/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BarChartOutlined,
  HistoryOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import PbLogoDark from "@assets/logo.png";
import PbLogo from "@assets/logo.svg";
import { useErrorContext } from "@src/contexts/ErrorContext";
import { useTheme } from "@src/contexts/ThemeContext";
import { queryClient } from "@src/services/queryClient";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Button, Menu, MenuProps, Tour } from "antd";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { Link, useLocation } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { useMenu } from "../../contexts/SidebarContext";
import { MenuRouteInterface, MenuRoutes } from "./menu";

type MenuItem = Required<MenuProps>["items"][number];

export const SidebarNavigation = () => {
  const { t } = useTranslation();
  const { resetErrors } = useErrorContext();
  const LargeDesktop = useMediaQuery({ maxHeight: "800px" });
  const isMobile = useMediaQuery({ maxWidth: "1250px" });
  const [collapsed, setCollapsed] = useState(true);
  const { handleChangeSidebar, isSidebarOpen } = useMenu();
  const [items, setItems] = useState<MenuItem[]>([]);
  const translation = useTranslation().i18n.language;
  const [openKeys, setOpenKeys] = useState(["institution"]);
  const { theme } = useTheme();
  const location = useLocation();
  const ref = useRef(null);
  const [routes, setRoutes] = useState<MenuRouteInterface[]>([]);
  const [recents, setRecents] = useState<{ id?: number; paths: string[] }[]>(
    []
  );

  const [isMenuTourOpen, setIsMenuTourOpen] = useState(true);

  const { permissions, id } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const [active, setActive] = useState<string>(
    location.pathname.split("/")[location.pathname.split("/").length - 1]
  );

  useEffect(() => {
    setActive(
      location.pathname.split("/")[location.pathname.split("/").length - 1]
    );
  }, [location]);

  const onOpenChange: MenuProps["onOpenChange"] = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (items.map((item) => item?.key).indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  // function handleNavigate(pathArray: string[]) {
  //   navigate(pathArray.reverse().join("/"));
  // setOpenKeys([])
  // }

  function getItem(
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[] | null,
    disabled?: boolean,
    style?: any,
    label?: React.ReactNode,
    theme?: string,
    type?: any,
    onClick?: any
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label: label ?? t(`menus.${key}`),
      disabled,
      style,
      theme,
      type,
      onClick: onClick
        ? onClick
        : (e: any) => {
            const userRecents = recents.find((user) => user.id === id); // Procurar recentes do usuário pelo ID
            const userRecentPaths = userRecents ? userRecents.paths : [];

            const path = e.keyPath.join("/");

            if (userRecentPaths.includes(path)) return; // Verificar se o caminho já está nos recentes

            const updatedRecents = [
              ...recents.filter((user) => user.id !== id), // Remover os recentes antigos do usuário
              { id, paths: [path, ...userRecentPaths.slice(0, 4)] }, // Adicionar o novo caminho aos recentes do usuário
            ];

            setRecents(updatedRecents); // Atualizar o estado dos recentes
            Cookies.set("recents", JSON.stringify(updatedRecents), {
              expires: 1 / 24,
            }); // Atualizar os cookies
          },
    } as MenuItem;
  }

  useEffect(() => {
    if (Cookies.get("recents"))
      setRecents(JSON.parse(Cookies.get("recents") as any));
  }, []);

  async function getRoutes() {
    setRoutes(await MenuRoutes());
  }

  useEffect(() => {
    getRoutes();
  }, [recents, translation, permissions]);

  useEffect(() => {
    setItems([
      getItem(
        "dashboard",
        <BarChartOutlined style={{ fontSize: "23px" }} />,
        null,
        false,
        { fontSize: "16px" },
        <Link
          onClickCapture={() => {
            if (isMobile) {
              setCollapsed(false);
              handleChangeSidebar(false);
            }
            setOpenKeys([]);
          }}
          to="/dashboard"
        >
          {t("menus.dashboard")}
        </Link>
      ),
      ...routes?.map((route) => {
        return getItem(
          route.key,
          route?.icon,
          route?.children &&
            route?.children?.map((children1) =>
              getItem(
                children1.key,
                children1?.icon,
                children1?.children &&
                  children1?.children?.map((children2) =>
                    getItem(
                      children2.key,
                      children2?.icon,
                      children2?.children &&
                        children2?.children?.map((children3) =>
                          getItem(
                            children3.key,
                            children3?.icon,
                            children3?.children &&
                              children3?.children?.map((children4) =>
                                getItem(
                                  children4.key,
                                  children4?.icon,
                                  undefined,
                                  children4.disabled,
                                  {
                                    ...children4.style,
                                    display: children4.permission
                                      ? undefined
                                      : "none",
                                  },
                                  children4.path && (
                                    <Link
                                      onClickCapture={() => {
                                        if (isMobile) {
                                          setCollapsed(false);
                                          handleChangeSidebar(false);
                                        }
                                        setOpenKeys([]);
                                      }}
                                      to={children4.path}
                                      title={
                                        t(`menus.${children4.label}`) || ""
                                      }
                                    >
                                      {t(`menus.${children4.label}`)}
                                    </Link>
                                  ),
                                  undefined,
                                  undefined,
                                  children4.onClick
                                )
                              ),
                            children3.disabled,
                            {
                              ...children3.style,
                              display: children3.permission
                                ? undefined
                                : "none",
                            },
                            children3.path && (
                              <Link
                                onClickCapture={() => {
                                  if (isMobile) {
                                    setCollapsed(false);
                                    handleChangeSidebar(false);
                                  }
                                  setOpenKeys([]);
                                }}
                                to={children3.path}
                                title={t(`menus.${children3.label}`) || ""}
                              >
                                {t(`menus.${children3.label}`)}
                              </Link>
                            ),
                            undefined,
                            undefined,
                            children3.onClick
                          )
                        ),
                      children2.disabled,
                      {
                        ...children2.style,
                        display: children2.permission ? undefined : "none",
                      },
                      children2.path && (
                        <Link
                          onClickCapture={() => {
                            if (isMobile) {
                              setCollapsed(false);
                              handleChangeSidebar(false);
                            }
                            setOpenKeys([]);
                          }}
                          to={children2.path}
                          title={t(`menus.${children2.label}`) || ""}
                        >
                          {t(`menus.${children2.label}`)}
                        </Link>
                      ),
                      undefined,
                      undefined,
                      children2.onClick
                    )
                  ),
                children1.disabled,
                {
                  ...children1.style,
                  display: children1.permission ? undefined : "none",
                },
                children1.path && (
                  <Link
                    onClickCapture={() => {
                      if (isMobile) {
                        setCollapsed(false);
                        handleChangeSidebar(false);
                      }
                      setOpenKeys([]);
                    }}
                    to={children1.path}
                    title={t(`menus.${children1.label}`) || ""}
                  >
                    {t(`menus.${children1.label}`)}
                  </Link>
                ),
                undefined,
                undefined,
                children1.onClick
              )
            ),
          route.disabled,
          { ...route.style, display: route.permission ? undefined : "none" },
          route.path && (
            <Link
              onClickCapture={() => {
                if (isMobile) {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }
                setOpenKeys([]);
              }}
              to={route.path}
            >
              {t(`menus.${route.label}`)}
            </Link>
          ),
          undefined,
          undefined,
          route.onClick
        );
      }),
      getItem(
        "div1",
        undefined,
        undefined,
        false,
        undefined,
        undefined,
        undefined,
        "divider"
      ),
      getItem(
        "recents",
        <HistoryOutlined />,
        null,
        true,
        {
          display: recents?.find((obj) => obj?.id === id)?.paths
            ? undefined
            : "none",
        },
        null,
        "dark",
        "group"
      ),
      ...(recents?.find((obj) => obj?.id === id)?.paths ?? []).map((path) =>
        getItem(
          `${
            path.split("/").reverse().join("/")[path.split("/").length - 1]
          }_recent`,
          null,
          null,
          false,
          {
            maxWidth: "100%",
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          },
          <Link
            onClickCapture={() => {
              setCollapsed(false);
              handleChangeSidebar(false);
            }}
            to={path.split("/").reverse().join("/")}
          >
            {t(
              `menus.${path.split("/").reverse()[path.split("/").length - 1]}`
            )}
          </Link>,
          undefined,
          undefined,
          () => {
            setRecents(recents);
          }
        )
      ),
    ]);
  }, [recents, translation, routes]);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    handleChangeSidebar(!collapsed);
  };

  return (
    <div
      style={{
        width: isMobile && !isSidebarOpen ? 0 : isSidebarOpen ? 256 : 80,
        height: "100vh",
        position: "fixed",
        zIndex: 999,
      }}
      ref={ref}
    >
      <Tour open={isMenuTourOpen} onClose={() => setIsMenuTourOpen(true)} />
      <motion.div
        whileHover={{ filter: "contrast(130%)" }}
        whileTap={{ filter: "contrast(100%)" }}
      >
        <Button
          type={
            isMobile && !isSidebarOpen
              ? "ghost"
              : theme === "dark"
              ? "primary"
              : "default"
          }
          onClick={toggleCollapsed}
          style={{
            height: LargeDesktop ? "8vh" : "6vh",
            width: isSidebarOpen ? 256 : 80,
            borderRadius: 0,
            backgroundColor:
              isMobile && !isSidebarOpen
                ? undefined
                : theme === "dark"
                ? "#222222"
                : "#fdfdfd",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "none",
            borderBottom: isMobile
              ? "none"
              : theme === "light"
              ? "1px solid #79797932"
              : "1px solid #4b4b4b44",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {isSidebarOpen && theme === "light" && (
              <img
                src={import.meta.env.VITE_APP_LOGO_LIGHT || PbLogo}
                style={{ width: "160px" }}
              />
            )}
             {isSidebarOpen && theme === "dark" && (
              <img
                src={import.meta.env.VITE_APP_LOGO || PbLogoDark}
                style={{ width: "160px" }}
              />
            )}
            {!isSidebarOpen ? (
              <MenuUnfoldOutlined
                style={{
                  fontSize: "26px",

                  color:
                    !isSidebarOpen && isMobile && theme === "light"
                      ? "#ffffff"
                      : theme === "dark"
                      ? "#fdfdfd"
                      : "#000",
                }}
              />
            ) : (
              <MenuFoldOutlined
                style={{
                  fontSize: "26px",
                  marginLeft: 24,
                  color:
                    !isSidebarOpen && isMobile && theme === "light"
                      ? "#000"
                      : theme === "dark"
                      ? "#fdfdfd"
                      : "#000",
                }}
              />
            )}
          </div>
        </Button>
      </motion.div>

      <Menu
        style={{
          minHeight: LargeDesktop ? "85vh" : "89vh",
          maxHeight: LargeDesktop ? "85vh" : "89vh",
          overflow: "auto",
          backgroundColor: theme === "dark" ? "#222222" : "#fff",
          display: isMobile && !isSidebarOpen ? "none" : "inherit",
        }}
        openKeys={isSidebarOpen ? openKeys : undefined}
        selectedKeys={[active]}
        onOpenChange={isSidebarOpen ? onOpenChange : undefined}
        disabledOverflow
        translate="yes"
        mode="inline"
        theme={"light"}
        inlineCollapsed={!isSidebarOpen}
        items={items}
      />
      {(!isMobile || isSidebarOpen) && (
        <motion.div
          whileHover={{ filter: "contrast(130%)" }}
          whileTap={{ filter: "contrast(100%)" }}
        >
          <Button
            type={"default"}
            onClick={() => {
              secureLocalStorage.removeItem("token");
              sessionStorage.removeItem("token");
              queryClient.refetchQueries(["validate"]);
              resetErrors();
            }}
            danger
            style={{
              height: LargeDesktop ? "8vh" : "5vh",
              width: isSidebarOpen ? 256 : 80,
              borderRadius: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "none",
            }}
            icon={<LogoutOutlined style={{ fontSize: "23px" }} />}
          >
            {isSidebarOpen && t("menus.logout")}
          </Button>
        </motion.div>
      )}
    </div>
  );
};
