import {
  DollarOutlined,
  FileSearchOutlined,
  FolderAddOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Menu, MenuProps } from "antd";
import React, { useEffect, useState } from "react";
import { useMenu } from "../../contexts/SidebarContext";
import { useNavigate } from "react-router-dom";
import { defaultTheme } from "../../styles/defaultTheme";
import { useMediaQuery } from "react-responsive";
import { useTranslation } from "react-i18next";
import { queryClient } from "@src/services/queryClient";

type MenuItem = Required<MenuProps>["items"][number];

export const SidebarNavigation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: "900px" });
  const [collapsed, setCollapsed] = useState(true);
  const { handleChangeSidebar, isSidebarOpen } = useMenu();
  const [items, setItems] = useState<MenuItem[]>([]);
  const translation = useTranslation().i18n.language;
  const [openKeys, setOpenKeys] = useState(["institution"]);

  const onOpenChange: MenuProps["onOpenChange"] = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (i.map((item) => item?.key).indexOf(latestOpenKey!) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  function handleNavigate(pathArray: string[]) {
    navigate(pathArray.reverse().join("/"));
  }

  function getItem(
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[] | null,
    disabled?: boolean,
    onClick?: (e: any) => void | null,
    style?: any,
    label?: React.ReactNode
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label: label ?? t(`menus.${key}`),
      disabled,
      onClick,
      style,
    } as MenuItem;
  }

  const i: MenuItem[] = [
    getItem(
      "institution",
      null,
      null,
      true,
      undefined,
      { fontSize: "16px" },
      import.meta.env.VITE_APP_COMPANY_NAME
    ),
    { type: "divider" },
    getItem("register", <FolderAddOutlined style={{ fontSize: "23px" }} />, [
      getItem("organization", null, [
        getItem(
          "users",
          null,
          null,
          false,
          (e) => handleNavigate(e?.keyPath)
          // { display: "none" }
        ),
        getItem("categories", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
        getItem("bank_maintain", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
        getItem("general_configs", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
        getItem(
          "organization_reports",
          null,
          [
            getItem("organization_reports_users", null, null, false, (e) =>
              handleNavigate(e?.keyPath.reverse())
            ),
            getItem("organization_reports_categories", null, null, false, (e) =>
              handleNavigate(e?.keyPath.reverse())
            ),
          ],
          false,
          (e) => handleNavigate(e?.keyPath)
        ),
      ]),
      getItem("operator", null, [
        getItem("operators", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
        getItem("operator_users", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
        getItem(
          "operator_reports",
          null,
          [
            getItem("operator_operators_reports", null, null, false, (e) =>
              handleNavigate(e?.keyPath.reverse())
            ),
            getItem("operator_users_reports", null, null, false, (e) =>
              handleNavigate(e?.keyPath.reverse())
            ),
          ],
          false,
          (e) => handleNavigate(e?.keyPath)
        ),
      ]),
      getItem("aggregator", null, [
        getItem("aggregators", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
        getItem("aggregator_users", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
        getItem(
          "aggregator_reports",
          null,
          [
            getItem("aggregator_aggregators_reports", null, null, false, (e) =>
              handleNavigate(e?.keyPath.reverse())
            ),
            getItem("aggregator_users_reports", null, null, false, (e) =>
              handleNavigate(e?.keyPath.reverse())
            ),
          ],
          false,
          (e) => handleNavigate(e?.keyPath)
        ),
      ]),
      getItem("partner", null, [
        getItem("partners", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
        getItem("partner_users", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
        getItem(
          "partner_reports",
          null,
          [
            getItem("partner_partners_reports", null, null, false, (e) =>
              handleNavigate(e?.keyPath.reverse())
            ),
            getItem("partner_users_reports", null, null, false, (e) =>
              handleNavigate(e?.keyPath.reverse())
            ),
          ],
          false,
          (e) => handleNavigate(e?.keyPath)
        ),
      ]),
      getItem("merchant", null, [
        getItem("merchants", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
        getItem("merchant_users", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
        getItem("merchant_blacklist", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
        getItem("manual_entry_category", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
        getItem("merchants_fee_plans", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
        getItem(
          "merchant_reports",
          null,
          [
            getItem("merchant_merchants_reports", null, null, false, (e) =>
              handleNavigate(e?.keyPath.reverse())
            ),
            getItem("merchant_users_reports", null, null, false, (e) =>
              handleNavigate(e?.keyPath.reverse())
            ),
          ],
          false,
          (e) => handleNavigate(e?.keyPath)
        ),
      ]),
      getItem("person", null, [
        getItem("persons", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
        getItem("whitelist", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
        getItem("person_accounts", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
        getItem("person_blacklist", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
        getItem(
          "person_reports",
          null,
          [
            getItem("person_persons_reports", null, null, false, (e) =>
              handleNavigate(e?.keyPath.reverse())
            ),
            getItem("client_bank_reports", null, null, false, (e) =>
              handleNavigate(e?.keyPath.reverse())
            ),
            getItem("pix_whitelist_reports", null, null, false, (e) =>
              handleNavigate(e?.keyPath.reverse())
            ),
          ],
          false,
          (e) => handleNavigate(e?.keyPath)
        ),
      ]),
    ]),
    getItem("moviment", <DollarOutlined style={{ fontSize: "23px" }} />, [
      getItem(
        "organization_moviments",
        null,
        [
          getItem("organization_manual_moviments", null, null, false, (e) =>
            handleNavigate(e?.keyPath.reverse())
          ),
          getItem("organization_moviments_reports", null, null, false, (e) =>
            handleNavigate(e?.keyPath.reverse())
          ),
        ],
        false,
        (e) => handleNavigate(e?.keyPath)
      ),
      getItem(
        "merchant_moviments",
        null,
        [
          getItem("merchant_manual_moviments", null, null, false, (e) =>
            handleNavigate(e?.keyPath.reverse())
          ),
          getItem("merchant_moviments_reports", null, null, false, (e) =>
            handleNavigate(e?.keyPath.reverse())
          ),
        ],
        false,
        (e) => handleNavigate(e?.keyPath)
      ),
    ]),
    getItem("consult", <FileSearchOutlined style={{ fontSize: "23px" }} />, [
      getItem("consult_organization", null, [
        getItem("organization_bank_statement", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
        getItem("organization_balance", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
        getItem("organization_history", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
        getItem("consult_organization_reports", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
      ]),
      getItem("consult_merchant", null, [
        getItem("merchant_bank_statement", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
        getItem("merchant_balance", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
        getItem("merchant_history", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
        getItem("consult_merchant_reports", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
      ]),
      getItem("deposit", null, [
        getItem("generated_deposits", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
        getItem("paid_deposits", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
        getItem("undelivered_deposits", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),

        getItem(
          "deposits_reports",
          null,
          [
            getItem("generated_deposits_reports", null, null, false, (e) =>
              handleNavigate(e?.keyPath.reverse())
            ),
            getItem("paid_deposits_reports", null, null, false, (e) =>
              handleNavigate(e?.keyPath.reverse())
            ),
            getItem("webhooks_reports", null, null, false, (e) =>
              handleNavigate(e?.keyPath.reverse())
            ),
          ],
          false,
          (e) => handleNavigate(e?.keyPath)
        ),
      ]),
      getItem("withdrawals", null, [
        getItem("generated_withdrawals", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
        getItem("paid_withdrawals", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
        getItem("undelivered_withdrawals", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),

        getItem(
          "withdrawals_reports",
          null,
          [
            getItem("generated_withdrawals_reports", null, null, false, (e) =>
              handleNavigate(e?.keyPath.reverse())
            ),
            getItem("paid_withdrawals_reports", null, null, false, (e) =>
              handleNavigate(e?.keyPath.reverse())
            ),
            getItem("withdrawals_webhooks_reports", null, null, false, (e) =>
              handleNavigate(e?.keyPath.reverse())
            ),
          ],
          false,
          (e) => handleNavigate(e?.keyPath)
        ),
      ]),
      getItem("refunds", null, [
        getItem("refund_deposits", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
        getItem("refund_withdrawals", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
        getItem("refund_manual_deposits", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
        getItem("refund_reports", null, [
          getItem("refund_deposits_reports", null, null, false, (e) =>
            handleNavigate(e?.keyPath)
          ),
          getItem("refund_manual_reports", null, null, false, (e) =>
            handleNavigate(e?.keyPath)
          ),
          getItem("refund_withdrawals_reports", null, null, false, (e) =>
            handleNavigate(e?.keyPath)
          ),
        ]),
      ]),
      getItem("consult_persons", null, [
        getItem("check_cpf", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
      ]),
     
    ]),
    getItem("support", <NotificationOutlined style={{ fontSize: "23px" }} />, [
      getItem("blacklists", null, [
        getItem("bank_institutions", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
        getItem("third_parties_pix_key", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
        getItem("invalid_pix_key", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
        getItem("blacklists_reports", null, [
          getItem("bank_institutions_reports", null, null, false, (e) =>
            handleNavigate(e?.keyPath)
          ),
        ]),
      ]),
      getItem("api_logs", null, [
        getItem("error_logs_deposits", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
        getItem("error_logs_withdrawals", null, null, false, (e) =>
          handleNavigate(e?.keyPath)
        ),
      ]),
    ]),
    getItem(
      "logout",
      <LogoutOutlined style={{ fontSize: "23px" }} />,
      null,
      false,
      () => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        queryClient.refetchQueries(["validate"]);
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
          maxHeight: "100%",
          overflow: "auto",
          backgroundColor: defaultTheme.colors.primary,
          display: isMobile && !isSidebarOpen ? "none" : "inherit",
        }}
        openKeys={isSidebarOpen ? openKeys : undefined}
        onOpenChange={isSidebarOpen ? onOpenChange : undefined}
        disabledOverflow
        translate="yes"
        mode="inline"
        theme={import.meta.env.VITE_APP_MENU_THEME}
        inlineCollapsed={!isSidebarOpen}
        items={items}
      />
    </div>
  );
};
