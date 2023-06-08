import {
  DollarOutlined,
  FileSearchOutlined,
  FolderAddOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import { Button, Menu, MenuProps } from "antd";
import React, { useState } from "react";
import { useMenu } from "../../contexts/SidebarContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { defaultTheme } from "../../styles/defaultTheme";
import { useMediaQuery } from "react-responsive";

type MenuItem = Required<MenuProps>["items"][number];

export const SidebarNavigation = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: "900px" });
  const [collapsed, setCollapsed] = useState(true);
  const { handleChangeSidebar, isSidebarOpen } = useMenu();
  const { signOut } = useAuth();

  function handleNavigate(pathArray: string[]) {
    navigate(pathArray.reverse().join("/"));
  }

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[] | null,
    disabled?: boolean,
    onClick?: (e: any) => void | null,
    style?: any
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
      disabled,
      onClick,
      style,
    } as MenuItem;
  }

  const items: MenuItem[] = [
    getItem("Paybrokers", "0", null, null, true),
    { type: "divider" },
    getItem(
      "Cadastro",
      "register",
      <FolderAddOutlined style={{ fontSize: "23px" }} />,
      [
        getItem("Paybrokers", "paybrokers", null, [
          getItem(
            "Usuários",
            "users",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath),
           // { display: "none" }
          ),
          getItem("Categorias", "categories", null, null, false, (e) =>
            handleNavigate(e?.keyPath)
          ),
          getItem(
            "Manutenção de bancos",
            "bank_maintain",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
          getItem(
            "Configurações gerais",
            "general_configs",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
          getItem("Relatórios", "paybrokers_reports", null, null, false, (e) =>
            handleNavigate(e?.keyPath)
          ),
        ]),
        getItem("Plataforma", "partner", null, [
          getItem("Plataformas", "partners", null, null, false, (e) =>
            handleNavigate(e?.keyPath)
          ),
          getItem("Usuários", "partner_users", null, null, false, (e) =>
            handleNavigate(e?.keyPath)
          ),
          getItem("Relatórios", "partner_reports", null, null, false, (e) =>
            handleNavigate(e?.keyPath)
          ),
        ]),
        getItem("Empresas", "merchant", null, [
          getItem("Empresas", "merchants", null, null, false, (e) =>
            handleNavigate(e?.keyPath)
          ),
          getItem("Usuários", "merchant_users", null, null, false, (e) =>
            handleNavigate(e?.keyPath)
          ),
          getItem("Blacklist", "merchant_blacklist", null, null, false, (e) =>
            handleNavigate(e?.keyPath)
          ),
          getItem("Relatórios", "merchant_reports", null, null, false, (e) =>
            handleNavigate(e?.keyPath)
          ),
        ]),
        getItem("Pessoas", "person", null, [
          getItem("Pessoas", "persons", null, null, false, (e) =>
            handleNavigate(e?.keyPath)
          ),
          getItem(
            "Whitelist de chaves PIX",
            "whitelist",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
          getItem(
            "Bancos de clientes",
            "person_accounts",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
          getItem("Blacklist", "person_blacklist", null, null, false, (e) =>
            handleNavigate(e?.keyPath)
          ),
          getItem("Relatórios", "person_reports", null, null, false, (e) =>
            handleNavigate(e?.keyPath)
          ),
        ]),
      ]
    ),
    getItem(
      "Movimentações",
      "moviment",
      <DollarOutlined style={{ fontSize: "23px" }} />,
      [
        getItem("Lançamentos manuais", "moviments", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
        getItem("Relatórios", "moviment_reports", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
      ]
    ),
    getItem(
      "Consultas",
      "consult",
      <FileSearchOutlined style={{ fontSize: "23px" }} />,
      [
        getItem("Paybrokers", "consult_paybrokers", null, [
          getItem(
            "Extrato",
            "paybrokers_bank_statement",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
          getItem("Saldo", "paybrokers_balance", null, null, false, (e) =>
            handleNavigate(e?.keyPath)
          ),
          getItem("Histórico", "paybrokers_history", null, null, false, (e) =>
            handleNavigate(e?.keyPath)
          ),
          getItem(
            "Relatórios",
            "consult_paybrokers_reports",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
        ]),
        getItem("Empresas", "consult_merchant", null, [
          getItem(
            "Extrato",
            "merchant_bank_statement",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
          getItem("Saldo", "merchant_balance", null, null, false, (e) =>
            handleNavigate(e?.keyPath)
          ),
          getItem("Histórico", "merchant_history", null, null, false, (e) =>
            handleNavigate(e?.keyPath)
          ),
          getItem(
            "Relatórios",
            "consult_merchant_reports",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
        ]),
        getItem("Depósitos", "deposit", null, [
          getItem("Gerados", "generated_deposits", null, null, false, (e) =>
            handleNavigate(e?.keyPath)
          ),
          getItem("Pagos", "paid_deposits", null, null, false, (e) =>
            handleNavigate(e?.keyPath)
          ),
          getItem(
            "Não entregues",
            "undelivered_deposits",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
          getItem(
            "Registro de erros",
            "error_logs_deposits",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
          getItem("Relatórios", "deposits_reports", null, null, false, (e) =>
            handleNavigate(e?.keyPath)
          ),
        ]),
        getItem("Saques", "42", null),
        getItem("Devoluções", "43", null),
        getItem("Pessoas", "44", null),
      ]
    ),
    getItem(
      "Suporte",
      "8",
      <NotificationOutlined style={{ fontSize: "23px" }} />
    ),
    getItem(
      "Sair",
      "logout",
      <LogoutOutlined style={{ fontSize: "23px" }} />,
      null,
      false,
      () => {
        signOut();
      },
      { color: "red" }
    ),
  ];

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    handleChangeSidebar(collapsed);
  };

  return (
    <div
      style={{ width: 256, height: "100vh", position: "fixed", zIndex: 999 }}
    >
      <Button
        type={isMobile && !isSidebarOpen ? "ghost" : "primary"}
        onClick={toggleCollapsed}
        style={{
          height: "55px",
          width: isSidebarOpen ? 256 : 80,
          borderRadius: "0",
        }}
      >
        {!isSidebarOpen ? (
          <MenuUnfoldOutlined style={{ fontSize: "26px" }} />
        ) : (
          <MenuFoldOutlined style={{ fontSize: "26px" }} />
        )}
      </Button>

      <Menu
        style={{
          minHeight: "100%",
          backgroundColor: defaultTheme.colors.primary,
          display: isMobile && !isSidebarOpen ? "none" : "inherit",
        }}
        disabledOverflow
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode={"inline"}
        theme="dark"
        inlineCollapsed={!isSidebarOpen}
        items={items}
      />
    </div>
  );
};
