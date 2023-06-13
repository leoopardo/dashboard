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
import React, { useEffect, useState } from "react";
import { useMenu } from "../../contexts/SidebarContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { defaultTheme } from "../../styles/defaultTheme";
import { useMediaQuery } from "react-responsive";
import { useTranslation } from "react-i18next";

type MenuItem = Required<MenuProps>["items"][number];

export const SidebarNavigation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: "900px" });
  const [collapsed, setCollapsed] = useState(true);
  const { handleChangeSidebar, isSidebarOpen } = useMenu();
  const [items, setItems] = useState<MenuItem[]>([]);
  const translation = useTranslation().i18n.language;
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

  const i: MenuItem[] = [
    getItem("Paybrokers", "0", null, null, true),
    { type: "divider" },
    getItem(
      t("menus.register"),
      "register",
      <FolderAddOutlined style={{ fontSize: "23px" }} />,
      [
        getItem("Paybrokers", "paybrokers", null, [
          getItem(
            t("menus.users"),
            "users",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
            // { display: "none" }
          ),
          getItem(t("menus.categories"), "categories", null, null, false, (e) =>
            handleNavigate(e?.keyPath)
          ),
          getItem(
            t("menus.bank_maintain"),
            "bank_maintain",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
          getItem(
            t("menus.general_configs"),
            "general_configs",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
          getItem(
            t("menus.paybrokers_reports"),
            "paybrokers_reports",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
        ]),
        getItem(t("menus.partner"), "partner", null, [
          getItem(t("menus.partners"), "partners", null, null, false, (e) =>
            handleNavigate(e?.keyPath)
          ),
          getItem(
            t("menus.partner_users"),
            "partner_users",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
          getItem(
            t("menus.partner_reports"),
            "partner_reports",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
        ]),
        getItem(t("menus.merchant"), "merchant", null, [
          getItem(t("menus.merchants"), "merchants", null, null, false, (e) =>
            handleNavigate(e?.keyPath)
          ),
          getItem(
            t("menus.merchant_users"),
            "merchant_users",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
          getItem(
            t("menus.merchant_blacklist"),
            "merchant_blacklist",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
          getItem(
            t("menus.merchant_reports"),
            "merchant_reports",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
        ]),
        getItem(t("menus.person"), "person", null, [
          getItem(t("menus.persons"), "persons", null, null, false, (e) =>
            handleNavigate(e?.keyPath)
          ),
          getItem(t("menus.whitelist"), "whitelist", null, null, false, (e) =>
            handleNavigate(e?.keyPath)
          ),
          getItem(
            t("menus.person_accounts"),
            "person_accounts",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
          getItem(
            t("menus.person_blacklist"),
            "person_blacklist",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
          getItem(
            t("menus.person_reports"),
            "person_reports",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
        ]),
      ]
    ),
    getItem(
      t("menus.moviment"),
      "moviment",
      <DollarOutlined style={{ fontSize: "23px" }} />,
      [
        getItem(t("menus.moviments"), "moviments", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
        getItem(
          t("menus.moviment_reports"),
          "moviment_reports",
          null,
          null,
          false,
          (e) => handleNavigate(e?.keyPath)
        ),
      ]
    ),
    getItem(
      t("menus.consult"),
      "consult",
      <FileSearchOutlined style={{ fontSize: "23px" }} />,
      [
        getItem("Paybrokers", "consult_paybrokers", null, [
          getItem(
            t("menus.paybrokers_bank_statement"),
            "paybrokers_bank_statement",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
          getItem(
            t("menus.paybrokers_balance"),
            "paybrokers_balance",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
          getItem(
            t("menus.paybrokers_history"),
            "paybrokers_history",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
          getItem(
            t("menus.consult_paybrokers_reports"),
            "consult_paybrokers_reports",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
        ]),
        getItem("Empresas", "consult_merchant", null, [
          getItem(
            t("menus.merchant_bank_statement"),
            "merchant_bank_statement",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
          getItem(
            t("menus.merchant_balance"),
            "merchant_balance",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
          getItem(
            t("menus.merchant_history"),
            "merchant_history",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
          getItem(
            t("menus.consult_merchant_reports"),
            "consult_merchant_reports",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
        ]),
        getItem(t("menus.deposit"), "deposit", null, [
          getItem(
            t("menus.generated_deposits"),
            "generated_deposits",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
          getItem(
            t("menus.paid_deposits"),
            "paid_deposits",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
          getItem(
            t("menus.undelivered_deposits"),
            "undelivered_deposits",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),

          getItem(
            t("menus.deposits_reports"),
            "deposits_reports",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
        ]),
        getItem(t("menus.withdrawals"), "withdrawals", null, [
          getItem(
            t("menus.generated_withdrawals"),
            "generated_withdrawals",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
          getItem(
            t("menus.paid_withdrawals"),
            "paid_withdrawals",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
          getItem(
            t("menus.undelivered_withdrawals"),
            "undelivered_withdrawals",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),

          getItem(
            t("menus.withdrawals_reports"),
            "withdrawals_reports",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
        ]),
        getItem(t("menus.refunds"), "refunds", null, [
          getItem(
            t("menus.refund_deposits"),
            "refund_deposits",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
          getItem(
            t("menus.refund_withdrawals"),
            "refund_withdrawals",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
          getItem(
            t("menus.refund_manual_deposits"),
            "refund_manual_deposits",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
          getItem(t("menus.refund_reports"), "error_logs_withdrawals", null, [
            getItem(
              t("menus.refund_deposits_reports"),
              "refund_deposits_reports",
              null,
              null,
              false,
              (e) => handleNavigate(e?.keyPath)
            ),
            getItem(
              t("menus.refund_manual_reports"),
              "refund_manual_reports",
              null,
              null,
              false,
              (e) => handleNavigate(e?.keyPath)
            ),
            getItem(
              t("menus.refund_withdrawals_reports"),
              "refund_withdrawals_reports",
              null,
              null,
              false,
              (e) => handleNavigate(e?.keyPath)
            ),
          ]),
        ]),
        getItem(t("menus.consult_persons"), "consult_persons", null, [
          getItem(t("menus.check_cpf"), "check_cpf", null, null, false, (e) =>
            handleNavigate(e?.keyPath)
          ),
        ]),
        getItem(t("menus.api_logs"), "api_logs", null, [
          getItem(
            t("menus.error_logs_deposits"),
            "error_logs_deposits",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
          getItem(
            "Registro de erros",
            "error_logs_withdrawals",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
        ]),
      ]
    ),
    getItem(
      "Suporte",
      "support",
      <NotificationOutlined style={{ fontSize: "23px" }} />,
      [
        getItem("Blacklists", "Blacklists", null, [
          getItem(
            t("menus.bank_institutions"),
            "bank_institutions",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
          getItem(
            t("menus.third_parties_pix_key"),
            "third_parties_pix_key",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
          getItem(
            t("menus.invalid_pix_key"),
            "invalid_pix_key",
            null,
            null,
            false,
            (e) => handleNavigate(e?.keyPath)
          ),
          getItem(t("menus.blacklists_reports"), "blacklists_reports", null, [
            getItem(
              t("menus.bank_institutions_reports"),
              "bank_institutions_reports",
              null,
              null,
              false,
              (e) => handleNavigate(e?.keyPath)
            ),
          ]),
        ]),
      ]
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

  useEffect(() => {
    setItems(i);
  }, [translation]);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    handleChangeSidebar(collapsed);
  };

  return (
    <div
      style={{
        width: isMobile && !isSidebarOpen ? 0 : isSidebarOpen ? 256 : 80,
        height: "100vh",
        position: "fixed",
        zIndex: 999,
      }}
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
        translate="yes"
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode={"inline"}
        theme={import.meta.env.VITE_APP_MENU_THEME}
        inlineCollapsed={!isSidebarOpen}
        items={items}
      />
    </div>
  );
};
