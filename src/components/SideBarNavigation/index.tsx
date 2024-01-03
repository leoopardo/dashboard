/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BarChartOutlined,
  DollarOutlined,
  FileSearchOutlined,
  FolderAddOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import PbLogo from "@assets/logo.png";
import { useErrorContext } from "@src/contexts/ErrorContext";
import { useTheme } from "@src/contexts/ThemeContext";
import { queryClient } from "@src/services/queryClient";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Button, Menu, MenuProps, Tour } from "antd";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { Link, useLocation } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { useMenu } from "../../contexts/SidebarContext";
import { defaultTheme } from "../../styles/defaultTheme";

type MenuItem = Required<MenuProps>["items"][number];

export const SidebarNavigation = () => {
  const { t } = useTranslation();
  // const navigate = useNavigate();
  const { resetErrors } = useErrorContext();
  const LargeDesktop = useMediaQuery({ maxHeight: "800px" });
  const isMobile = useMediaQuery({ maxWidth: "950px" });
  const [collapsed, setCollapsed] = useState(true);
  const { handleChangeSidebar, isSidebarOpen } = useMenu();
  const [items, setItems] = useState<MenuItem[]>([]);
  const translation = useTranslation().i18n.language;
  const [openKeys, setOpenKeys] = useState(["institution"]);
  const { theme } = useTheme();
  const location = useLocation();

  const [isMenuTourOpen, setIsMenuTourOpen] = useState(true);

  const { permissions, type } = queryClient.getQueryData(
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
    if (i.map((item) => item?.key).indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  // function handleNavigate(pathArray: string[]) {
  //   navigate(pathArray.reverse().join("/"));
  //   handleChangeSidebar(false);
  // }

  function getItem(
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[] | null,
    disabled?: boolean,
    onClick?: (e: any) => void | null,
    style?: any,
    label?: React.ReactNode,
    theme?: string,
    type?: any
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label: label ?? t(`menus.${key}`),
      disabled,
      onClick,
      style,
      theme,
      type,
    } as MenuItem;
  }

  const i: MenuItem[] = [
    getItem(
      "dashboard",
      <BarChartOutlined style={{ fontSize: "23px" }} />,
      null,
      false,
      undefined,
      { fontSize: "16px" },
      <Link
        onClickCapture={() => {
          setCollapsed(false);
          handleChangeSidebar(false);
        }}
        to={"/dashboard"}
      >
        {t("menus.dashboard")}
      </Link>,
      "dark"
    ),

    // - CADASTROS
    getItem(
      "register",
      <FolderAddOutlined style={{ fontSize: "23px" }} />,
      [
        // - CADASTROS DE ORGANIZAÇÃO
        getItem(
          "organization",
          null,
          [
            getItem(
              "users",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.register?.paybrokers?.users?.menu
                  ? undefined
                  : "none",
              },

              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/register/organization/users"}
                title={`${t("menus.users")}`}
              >
                {t("menus.users")}
              </Link>
            ),
            getItem(
              "categories",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.register?.paybrokers?.release_category
                  ?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/register/organization/categories"}
              >
                {t("menus.categories")}
              </Link>
            ),
            getItem(
              "bank_maintain",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.register?.paybrokers?.banks_maintain?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/register/organization/bank_maintain"}
              >
                {t("menus.bank_maintain")}
              </Link>
            ),
            getItem(
              "general_configs",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.register?.paybrokers?.general_configs
                  ?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/register/organization/general_configs"}
              >
                {t("menus.general_configs")}
              </Link>
            ),
            getItem(
              "permissions_groups",
              null,
              null,
              false,
              undefined,
              {
                display: type === 1 ? undefined : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/register/organization/permissions_groups"}
              >
                {t("menus.permissions_groups")}
              </Link>
            ),
            getItem(
              "organization_reports",
              null,
              [
                getItem(
                  "organization_reports_users",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.register?.paybrokers?.users
                      ?.paybrokers_user_export_csv
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={
                      "/register/organization/organization_reports/organization_reports_users"
                    }
                    title={`${t("menus.organization_reports_users")}`}
                  >
                    {t("menus.organization_reports_users")}
                  </Link>
                ),
                getItem(
                  "organization_reports_categories",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.register?.paybrokers?.release_category
                      ?.paybrokers_release_category_export_csv
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={
                      "/register/organization/organization_reports/organization_reports_categories"
                    }
                  >
                    {t("menus.organization_reports_categories")}
                  </Link>
                ),
              ],
              false,
              undefined,
              {
                display:
                  permissions?.register?.paybrokers?.users
                    ?.paybrokers_user_export_csv ||
                  permissions?.register?.paybrokers?.release_category
                    ?.paybrokers_release_category_export_csv
                    ? undefined
                    : "none",
              }
            ),
          ],
          undefined,
          undefined,
          {
            display: permissions?.register?.paybrokers?.menu
              ? undefined
              : "none",
          }
        ),
        // - CADASTROS DE AGREGADORES
        getItem(
          "aggregator",
          null,
          [
            getItem(
              "aggregators",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.register?.aggregator?.aggregator?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/register/aggregator/aggregators"}
              >
                {t("menus.aggregators")}
              </Link>
            ),
            getItem(
              "aggregator_users",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.register?.aggregator?.users?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/register/aggregator/aggregator_users"}
              >
                {t("menus.aggregator_users")}
              </Link>
            ),
            getItem(
              "self_exclusion",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.register?.aggregator?.self_exclusion?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/register/aggregator/self_exclusion"}
              >
                {t("menus.self_exclusion")}
              </Link>
            ),
            getItem(
              "aggregator_blacklist",
              null,
              [
                getItem(
                  "aggregator_blacklist_blacklist",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.register?.aggregator?.aggregator
                      ?.aggregator_export_csv
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={
                      "/register/aggregator/aggregator_blacklist/aggregator_blacklist_blacklist"
                    }
                    title={`${t("menus.aggregator_blacklist_blacklist")}`}
                  >
                    {t("menus.aggregator_blacklist_blacklist")}
                  </Link>
                ),
              ],
              false,
              undefined,
              {
                display:
                  permissions?.register?.aggregator?.aggregator
                    ?.aggregator_export_csv ||
                  permissions?.register?.aggregator?.users
                    ?.aggregator_user_export_csv
                    ? undefined
                    : "none",
              }
            ),
            getItem(
              "aggregator_reports",
              null,
              [
                getItem(
                  "aggregator_aggregators_reports",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.register?.aggregator?.aggregator
                      ?.aggregator_export_csv
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={
                      "/register/aggregator/aggregator_reports/aggregator_aggregators_reports"
                    }
                  >
                    {t("menus.aggregator_aggregators_reports")}
                  </Link>
                ),
                getItem(
                  "aggregator_users_reports",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.register?.aggregator?.users
                      ?.aggregator_user_export_csv
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={
                      "/register/aggregator/aggregator_reports/aggregator_users_reports"
                    }
                    title={`${t("menus.aggregator_users_reports")}`}
                  >
                    {t("menus.aggregator_users_reports")}
                  </Link>
                ),
                getItem(
                  "aggregator_blacklist_reports",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.register?.aggregator?.blacklist
                      .aggregator_blacklist_export_csv
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={
                      "/register/aggregator/aggregator_reports/aggregator_blacklist_reports"
                    }
                  >
                    {t("menus.aggregator_blacklist_reports")}
                  </Link>
                ),
                getItem(
                  "self_exclusion_reports",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.register?.aggregator?.self_exclusion
                      .aggregator_self_exclusion_export_csv
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={
                      "/register/aggregator/aggregator_reports/self_exclusion_reports"
                    }
                  >
                    {t("menus.self_exclusion_reports")}
                  </Link>
                ),
              ],
              false,
              undefined,
              {
                display:
                  permissions?.register?.aggregator?.aggregator
                    ?.aggregator_export_csv ||
                  permissions?.register?.aggregator?.users
                    ?.aggregator_user_export_csv
                    ? undefined
                    : "none",
              }
            ),
          ],
          undefined,
          undefined,
          {
            display: permissions?.register?.aggregator?.menu
              ? undefined
              : "none",
          }
        ),
        // - CADASTROS DE PLATAFORMAS
        getItem(
          "partner",
          null,
          [
            getItem(
              "partners",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.register?.partner?.partner?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/register/partner/partners"}
              >
                {t("menus.partners")}
              </Link>
            ),
            getItem(
              "partner_users",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.register?.partner?.users?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/register/partner/partner_users"}
              >
                {t("menus.partner_users")}
              </Link>
            ),
            getItem(
              "partner_reports",
              null,
              [
                getItem(
                  "partner_partners_reports",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.register?.partner?.partner
                      ?.partner_export_csv
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={
                      "/register/partner/partner_reports/partner_partners_reports"
                    }
                  >
                    {t("menus.partner_partners_reports")}
                  </Link>
                ),
                getItem(
                  "partner_users_reports",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.register?.partner?.users
                      ?.partner_user_export_csv
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={
                      "/register/partner/partner_reports/partner_users_reports"
                    }
                    title={`${t("menus.partner_users_reports")}`}
                  >
                    {t("menus.partner_users_reports")}
                  </Link>
                ),
              ],
              false,
              undefined,
              {
                display:
                  permissions?.register?.partner?.partner?.partner_export_csv ||
                  permissions?.register?.partner?.users?.partner_user_export_csv
                    ? undefined
                    : "none",
              }
            ),
          ],
          undefined,
          undefined,
          {
            display: permissions?.register?.partner?.menu ? undefined : "none",
          }
        ),
        // - CADASTROS DE OPERADORES
        getItem(
          "operator",
          null,
          [
            getItem(
              "operators",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.register?.operator?.operator?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/register/operator/operators"}
              >
                {t("menus.operators")}
              </Link>
            ),
            getItem(
              "operator_users",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.register?.operator?.users?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/register/operator/operator_users"}
              >
                {t("menus.operator_users")}
              </Link>
            ),
            getItem(
              "operator_reports",
              null,
              [
                getItem(
                  "operator_operators_reports",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.register?.operator?.operator
                      ?.operator_export_csv
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={
                      "/register/operator/operator_reports/operator_operators_reports"
                    }
                  >
                    {t("menus.operator_operators_reports")}
                  </Link>
                ),
                getItem(
                  "operator_users_reports",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.register?.operator?.users
                      ?.operator_user_export_csv
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={
                      "/register/operator/operator_reports/operator_users_reports"
                    }
                    title={`${t("menus.operator_users_reports")}`}
                  >
                    {t("menus.operator_users_reports")}
                  </Link>
                ),
              ],
              false,
              undefined,
              {
                display:
                  permissions?.register?.operator?.operator
                    ?.operator_export_csv ||
                  permissions?.register?.operator?.users
                    ?.operator_user_export_csv
                    ? undefined
                    : "none",
              }
            ),
          ],
          undefined,
          undefined,
          {
            display: permissions?.register?.operator?.menu ? undefined : "none",
          }
        ),
        // - CADASTROS DE EMPRESAS
        getItem(
          "merchant",
          null,
          [
            getItem(
              "merchants",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.register?.merchant?.merchant?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/register/merchant/merchants"}
              >
                {t("menus.merchants")}
              </Link>
            ),
            getItem(
              "merchant_users",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.register?.merchant?.users?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/register/merchant/merchant_users"}
              >
                {t("menus.merchant_users")}
              </Link>
            ),
            getItem(
              "manual_entry_category",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.register?.merchant?.release_category?.menu
                  ? undefined
                  : "none",
              },
              <Link
              onClickCapture={() => {
                setCollapsed(false);
                handleChangeSidebar(false);
              }}
              to={"/register/merchant/manual_entry_category"}
            >
              {t("menus.manual_entry_category")}
            </Link>
            ),
            getItem(
              "fee_plans",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.register?.merchant?.fee_plans?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/register/merchant/fee_plans"}
              >
                {t("menus.fee_plans")}
              </Link>
            ),
            getItem("merchant_blacklists", null, [
              getItem(
                "merchant_blacklist",
                null,
                null,
                false,
                undefined,
                {
                  display: permissions?.register?.merchant?.blacklist?.menu
                    ? undefined
                    : "none",
                },
                <Link
                  onClickCapture={() => {
                    setCollapsed(false);
                    handleChangeSidebar(false);
                  }}
                  to={
                    "/register/merchant/merchant_blacklists/merchant_blacklist"
                  }
                >
                  {t("menus.merchant_blacklist")}
                </Link>
              ),
              // todo

              // getItem(
              //   "import_merchant_blacklist",
              //   null,
              //   null,
              //   false,
              //   undefined,
              //   {
              //     display: permissions?.register?.merchant?.blacklist
              //       ?.merchant_blacklist_create
              //       ? undefined
              //       : "none",
              //   }
              // ),
              // getItem(
              //   "uploads_merchant_blacklist",
              //   null,
              //   null,
              //   false,
              //   undefined,
              //   {
              //     display: permissions?.register?.merchant?.blacklist
              //       ?.merchant_blacklist_create
              //       ? undefined
              //       : "none",
              //   }
              // ),
              getItem(
                "merchant_blacklist_reasons",
                null,
                null,
                false,
                undefined,
                {
                  display: permissions?.register?.merchant?.black_list_reason
                    .menu
                    ? undefined
                    : "none",
                },
                <Link
                  onClickCapture={() => {
                    setCollapsed(false);
                    handleChangeSidebar(false);
                  }}
                  to={
                    "/register/merchant/merchant_blacklists/merchant_blacklist_reasons"
                  }
                  title={`${t("menus.merchant_blacklist_reasons")}`}
                >
                  {t("menus.merchant_blacklist_reasons")}
                </Link>
              ),
            ]),
            getItem(
              "merchant_reports",
              null,
              [
                getItem(
                  "merchant_merchants_reports",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.register?.merchant?.merchant
                      ?.merchant_export_csv
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={
                      "/register/merchant/merchant_reports/merchant_merchants_reports"
                    }
                  >
                    {t("menus.merchant_merchants_reports")}
                  </Link>
                ),
                getItem(
                  "merchant_users_reports",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.register?.merchant?.users
                      ?.merchant_user_export_csv
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={
                      "/register/merchant/merchant_reports/merchant_users_reports"
                    }
                  >
                    {t("menus.merchant_users_reports")}
                  </Link>
                ),
                getItem(
                  "merchant_blacklist_reports",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.register?.merchant?.blacklist
                      .merchant_blacklist_export_csv
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={
                      "/register/merchant/merchant_reports/merchant_blacklist_reports"
                    }
                  >
                    {t("menus.merchant_blacklist_reports")}
                  </Link>
                ),
              ],
              false,
              undefined,
              {
                display:
                  permissions?.register?.merchant?.merchant
                    ?.merchant_export_csv ||
                  permissions?.register?.merchant?.users
                    ?.merchant_user_export_csv
                    ? undefined
                    : "none",
              }
            ),
          ],
          undefined,
          undefined,
          {
            display: permissions?.register?.merchant?.menu ? undefined : "none",
          }
        ),
        // - CADASTROS DE PESSOAS
        getItem(
          "person",
          null,
          [
            getItem(
              "persons",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.register?.person?.person?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/register/person/persons"}
              >
                {t("menus.persons")}
              </Link>
            ),
            // getItem(
            //   "whitelist",
            //   null,
            //   null,
            //   false,
            //   undefined,
            //   {
            //     display: permissions?.register?.person?.pix_whitelist?.menu
            //       ? undefined
            //       : "none",
            //   }
            // ),
            getItem(
              "person_accounts",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.register?.person?.client_banks?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/register/person/person_accounts"}
              >
                {t("menus.person_accounts")}
              </Link>
            ),
            getItem(
              "person_blacklist",
              null,
              [
                getItem(
                  "upload_person_blacklist",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.register?.person?.person?.menu
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={
                      "/register/person/person_blacklist/upload_person_blacklist"
                    }
                  >
                    {t("menus.upload_person_blacklist")}
                  </Link>
                ),
                getItem(
                  "person_blacklist_uploads",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.register?.person?.person?.menu
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={
                      "/register/person/person_blacklist/person_blacklist_uploads"
                    }
                  >
                    {t("menus.person_blacklist_uploads")}
                  </Link>
                ),
                getItem(
                  "person_blacklist_reasons",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.register?.person?.person?.menu
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={
                      "/register/person/person_blacklist/person_blacklist_reasons"
                    }
                    title={`${t("menus.person_blacklist_reasons")}`}
                  >
                    {t("menus.person_blacklist_reasons")}
                  </Link>
                ),
              ],
              false,
              undefined,
              {
                display: permissions?.register?.person?.blacklist?.menu
                  ? undefined
                  : "none",
              }
            ),
            getItem(
              "person_reports",
              null,
              [
                getItem(
                  "person_persons_reports",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.register?.person?.person
                      ?.person_person_export_csv
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={
                      "/register/person/person_reports/person_persons_reports"
                    }
                  >
                    {t("menus.person_persons_reports")}
                  </Link>
                ),
                getItem(
                  "client_bank_reports",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.register?.person?.client_banks
                      ?.person_client_banks_export_csv
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={"/register/person/person_reports/client_bank_reports"}
                  >
                    {t("menus.client_bank_reports")}
                  </Link>
                ),
                // getItem(
                //   "pix_whitelist_reports",
                //   null,
                //   null,
                //   false,
                //   undefined,
                //   {
                //     display: permissions?.register?.person?.pix_whitelist
                //       ?.person_pix_whitelist_export_csv
                //       ? undefined
                //       : "none",
                //   }
                // ),
              ],
              false,
              undefined,
              {
                display:
                  permissions?.register?.person?.person
                    ?.person_person_export_csv ||
                  permissions?.register?.person?.client_banks
                    ?.person_client_banks_export_csv ||
                  permissions?.register?.person?.pix_whitelist
                    ?.person_pix_whitelist_export_csv
                    ? undefined
                    : "none",
              }
            ),
          ],
          undefined,
          undefined,
          {
            display: permissions?.register?.person?.menu ? undefined : "none",
          }
        ),
      ],
      undefined,
      undefined,
      {
        display:
          permissions?.register?.aggregator.menu ||
          permissions?.register?.merchant.menu ||
          permissions?.register?.operator.menu ||
          permissions?.register?.partner.menu ||
          permissions?.register?.paybrokers.menu ||
          permissions?.register?.person.menu
            ? undefined
            : "none",
      }
    ),
    // - MOVIMENTAÇÕES
    getItem(
      "moviment",
      <DollarOutlined style={{ fontSize: "23px" }} />,
      [
        // - MOVIMENTAÇÕES DE ORGANIZAÇÃO
        getItem(
          "organization_moviments",
          null,
          [
            getItem(
              "organization_manual_moviments",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.transactions?.paybrokers
                  ?.manual_transactions?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={
                  "/moviment/organization_moviments/organization_manual_moviments"
                }
              >
                {t("menus.organization_manual_moviments")}
              </Link>
            ),
            //ajustar permissões
            getItem(
              "organization_transfer_between_accounts",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.transactions?.paybrokers
                  ?.manual_transactions?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={
                  "/moviment/organization_moviments/organization_transfer_between_accounts"
                }
                title={`${t("menus.organization_transfer_between_accounts")}`}
              >
                {t("menus.organization_transfer_between_accounts")}
              </Link>
            ),
            getItem(
              "organization_moviments_reports",
              null,
              [
                getItem(
                  "organization_manual_moviments_reports",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.transactions?.paybrokers
                      ?.manual_transactions
                      ?.paybrokers_manual_transactions_export_csv
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={
                      "/moviment/organization_moviments/organization_moviments_reports/organization_manual_moviments_reports"
                    }
                    title={`${t(
                      "menus.organization_manual_moviments_reports"
                    )}`}
                  >
                    {t("menus.organization_manual_moviments_reports")}
                  </Link>
                ),
                //ajustar permisssões
                getItem(
                  "organization_transfer_between_accounts_reports",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.transactions?.paybrokers
                      ?.manual_transactions
                      ?.paybrokers_manual_transactions_export_csv
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={
                      "/moviment/organization_moviments/organization_moviments_reports/organization_transfer_between_accounts_reports"
                    }
                    title={`${t(
                      "menus.organization_transfer_between_accounts_reports"
                    )}`}
                  >
                    {t("menus.organization_transfer_between_accounts_reports")}
                  </Link>
                ),
              ],
              false,
              undefined,
              {
                display: permissions?.transactions?.paybrokers
                  ?.manual_transactions
                  ?.paybrokers_manual_transactions_export_csv
                  ? undefined
                  : "none",
              }
            ),
          ],
          false,
          undefined,
          {
            display: permissions?.transactions?.paybrokers?.menu
              ? undefined
              : "none",
          }
        ),
        // - MOVIMENTAÇÕES DE AGREGADOR
        getItem(
          "aggregator_moviments",
          null,
          [
            //ajustar permissões
            getItem(
              "aggregator_transfer_between_accounts",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.transactions?.paybrokers
                  ?.manual_transactions?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={
                  "/moviment/aggregator_moviments/aggregator_transfer_between_accounts"
                }
                title={`${t("menus.aggregator_transfer_between_accounts")}`}
              >
                {t("menus.organization_transfer_between_accounts_reports")}
              </Link>
            ),
            getItem(
              "aggregator_moviments_reports",
              null,
              [
                //ajustar permisssões
                getItem(
                  "aggregator_transfer_between_accounts_reports",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.transactions?.paybrokers
                      ?.manual_transactions
                      ?.paybrokers_manual_transactions_export_csv
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={
                      "/moviment/aggregator_moviments/aggregator_moviments_reports/aggregator_transfer_between_accounts_reports"
                    }
                    title={`${t(
                      "menus.aggregator_transfer_between_accounts_reports"
                    )}`}
                  >
                    {t("menus.aggregator_transfer_between_accounts_reports")}
                  </Link>
                ),
              ],
              false,
              undefined,
              {
                display: permissions?.transactions?.paybrokers
                  ?.manual_transactions
                  ?.paybrokers_manual_transactions_export_csv
                  ? undefined
                  : "none",
              }
            ),
          ],
          false,
          undefined,
          {
            display: permissions?.transactions?.paybrokers?.menu
              ? undefined
              : "none",
          }
        ),
        // - MOVIMENTAÇÕES DE EMPRESA
        getItem(
          "merchant_moviments",
          null,
          [
            getItem(
              "merchant_manual_moviments",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.transactions?.merchant
                  ?.manual_transactions?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/moviment/merchant_moviments/merchant_manual_moviments"}
              >
                {t("menus.merchant_manual_moviments")}
              </Link>
            ),

            //ajustar permissões
            getItem(
              "between_accounts_transfers",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.transactions?.merchant
                  ?.manual_transactions?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/moviment/merchant_moviments/between_accounts_transfers"}
                title={`${t("menus.between_accounts_transfers")}`}
              >
                {t("menus.between_accounts_transfers")}
              </Link>
            ),
            getItem(
              "merchant_pre_manual_moviment",
              null,
              [
                getItem(
                  "merchant_pre_manual_moviments",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.transactions?.merchant
                      ?.merchant_pre_manual?.menu
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={
                      "/moviment/merchant_moviments/merchant_pre_manual_moviment/merchant_pre_manual_moviments"
                    }
                    title={`${t("menus.merchant_pre_manual_moviments")}`}
                  >
                    {t("menus.merchant_pre_manual_moviments")}
                  </Link>
                ),
                // getItem(
                //   "merchant_pre_manual_moviments_import",
                //   null,
                //   null,
                //   false,
                //   undefined,
                //   {
                //     display: permissions?.transactions?.merchant
                //       ?.merchant_pre_manual?.menu
                //       ? undefined
                //       : "none",
                //   },
                //   <Link
                //     onClickCapture={() => {
                //       setCollapsed(false);
                //       handleChangeSidebar(false);
                //     }}
                //     to={
                //       "/moviment/merchant_moviments/merchant_pre_manual_moviment/merchant_pre_manual_moviments_import"
                //     }
                //     title={`${t("menus.merchant_pre_manual_moviments_import")}`}
                //   >
                //     {t("menus.merchant_pre_manual_moviments_import")}
                //   </Link>
                // ),
                // getItem(
                //   "merchant_pre_manual_moviments_uploads",
                //   null,
                //   null,
                //   false,
                //   undefined,
                //   {
                //     display: permissions?.transactions?.merchant
                //       ?.merchant_pre_manual?.menu
                //       ? undefined
                //       : "none",
                //   },
                //   <Link
                //     onClickCapture={() => {
                //       setCollapsed(false);
                //       handleChangeSidebar(false);
                //     }}
                //     to={
                //       "/moviment/merchant_moviments/merchant_pre_manual_moviment/merchant_pre_manual_moviments_uploads"
                //     }
                //     title={`${t(
                //       "menus.merchant_pre_manual_moviments_uploads"
                //     )}`}
                //   >
                //     {t("menus.merchant_pre_manual_moviments_uploads")}
                //   </Link>
                // ),
              ],
              false,
              undefined,
              {
                display: permissions?.transactions?.merchant
                  ?.merchant_pre_manual?.menu
                  ? undefined
                  : "none",
              }
            ),
            getItem(
              "merchant_moviments_reports",
              null,
              [
                getItem(
                  "merchant_manual_moviments_reports",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.transactions?.merchant
                      ?.manual_transactions
                      ?.merchant_manual_transactions_export_csv
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={
                      "/moviment/merchant_moviments/merchant_moviments_reports/merchant_manual_moviments_reports"
                    }
                    title={`${t("menus.merchant_manual_moviments_reports")}`}
                  >
                    {t("menus.merchant_manual_moviments_reports")}
                  </Link>
                ),
                getItem(
                  "merchant_between_accounts_reports",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.transactions?.merchant
                      ?.manual_transactions
                      ?.merchant_manual_transactions_export_csv
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={
                      "/moviment/merchant_moviments/merchant_moviments_reports/merchant_between_accounts_reports"
                    }
                    title={`${t("menus.merchant_between_accounts_reports")}`}
                  >
                    {t("menus.merchant_between_accounts_reports")}
                  </Link>
                ),
                //TODO arrumar permissão Reports Pre manual
                getItem(
                  "merchant_pre_manual_moviments_reports",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.transactions?.merchant
                      ?.merchant_pre_manual?.menu
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={
                      "/moviment/merchant_moviments/merchant_moviments_reports/merchant_pre_manual_moviments_reports"
                    }
                    title={`${t(
                      "menus.merchant_pre_manual_moviments_reports"
                    )}`}
                  >
                    {t("menus.merchant_pre_manual_moviments_reports")}
                  </Link>
                ),
              ],
              false,
              undefined,
              {
                display: permissions?.transactions?.merchant
                  ?.manual_transactions?.merchant_manual_transactions_export_csv
                  ? undefined
                  : "none",
              }
            ),
          ],
          false,
          undefined,
          {
            display: permissions?.transactions?.merchant?.menu
              ? undefined
              : "none",
          }
        ),
        // TODO arrumar permissão
        getItem(
          "merchant_transfers",
          null,
          null,
          false,
          undefined,
          {
            display: type !== 3 ? undefined : "none",
          },
          <Link
            onClickCapture={() => {
              setCollapsed(false);
              handleChangeSidebar(false);
            }}
            to={"/moviment/merchant_transfers"}
            title={`${t("menus.merchant_transfers")}`}
          >
            {t("menus.merchant_transfers")}
          </Link>
        ),
      ],
      undefined,
      undefined,
      {
        display: permissions?.transactions?.menu ? undefined : "none",
      }
    ),
    // - CONSULTAS
    getItem(
      "consult",
      <FileSearchOutlined style={{ fontSize: "23px" }} />,
      [
        // - CONSULTAS DE ORGANIZAÇÃO
        getItem(
          "consult_organization",
          null,
          [
            getItem(
              "organization_bank_statement",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.report?.paybrokers?.extract?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/consult/consult_organization/organization_bank_statement"}
              >
                {t("menus.organization_bank_statement")}
              </Link>
            ),
            getItem(
              "organization_balance",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.report?.paybrokers?.balance?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/consult/consult_organization/organization_balance"}
              >
                {t("menus.organization_balance")}
              </Link>
            ),
            getItem(
              "organization_bank_balance",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.report?.paybrokers?.extract?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/consult/consult_organization/organization_bank_balance"}
              >
                {t("menus.organization_bank_balance")}
              </Link>
            ),
            getItem(
              "organization_history",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.report?.paybrokers?.bank_history?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/consult/consult_organization/organization_history"}
              >
                {t("menus.organization_history")}
              </Link>
            ),
            getItem(
              "consult_organization_reports",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.report?.paybrokers?.extract
                  ?.report_paybrokers_extract_export_csv
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={
                  "/consult/consult_organization/consult_organization_reports"
                }
              >
                {t("menus.consult_organization_reports")}
              </Link>
            ),
          ],
          undefined,
          undefined,
          {
            display: permissions?.report?.paybrokers?.menu ? undefined : "none",
          }
        ),

        // - CONSULTAS DE EMPRESA
        getItem(
          "consult_merchant",
          null,
          [
            getItem(
              "merchant_bank_statement",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.report?.merchant?.extract?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/consult/consult_merchant/merchant_bank_statement"}
              >
                {t("menus.merchant_bank_statement")}
              </Link>
            ),
            getItem(
              "merchant_balance",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.report?.merchant?.balance?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/consult/consult_merchant/merchant_balance"}
              >
                {t("menus.merchant_balance")}
              </Link>
            ),
            getItem(
              "merchant_history",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.report?.merchant?.balance_history?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/consult/consult_merchant/merchant_history"}
              >
                {t("menus.merchant_history")}
              </Link>
            ),
            getItem(
              "consult_merchant_reports",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.report?.merchant?.extract
                  ?.report_merchant_extract_export_csv
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/consult/consult_merchant/consult_merchant_reports"}
              >
                {t("menus.consult_merchant_reports")}
              </Link>
            ),
          ],
          undefined,
          undefined,
          {
            display: permissions?.report?.merchant?.menu ? undefined : "none",
          }
        ),
        // - CONSULTAS DE DEPÓSITOS
        getItem(
          "deposit",
          null,
          [
            getItem(
              "generated_deposits",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.report?.deposit?.generated_deposit?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/consult/deposit/generated_deposits"}
              >
                {t("menus.generated_deposits")}
              </Link>
            ),
            getItem(
              "paid_deposits",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.report?.deposit?.paid_deposit?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/consult/deposit/paid_deposits"}
              >
                {t("menus.paid_deposits")}
              </Link>
            ),
            getItem(
              "undelivered_deposits",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.report?.deposit?.undelivered_deposit?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/consult/deposit/undelivered_deposits"}
                title={`${t("menus.undelivered_deposits")}`}
              >
                {t("menus.undelivered_deposits")}
              </Link>
            ),
            getItem(
              "receipts",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.report?.deposit?.deposit_receipt?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/consult/deposit/receipts"}
              >
                {t("menus.receipts")}
              </Link>
            ),

            getItem(
              "deposits_reports",
              null,
              [
                getItem(
                  "generated_deposits_reports",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.report?.deposit?.generated_deposit
                      ?.report_deposit_generated_deposit_export_csv
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={
                      "/consult/deposit/deposits_reports/generated_deposits_reports"
                    }
                  >
                    {t("menus.generated_deposits_reports")}
                  </Link>
                ),
                getItem(
                  "paid_deposits_reports",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.report?.deposit?.paid_deposit
                      ?.report_deposit_paid_deposit_export_csv
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={
                      "/consult/deposit/deposits_reports/paid_deposits_reports"
                    }
                  >
                    {t("menus.paid_deposits_reports")}
                  </Link>
                ),
                getItem(
                  "webhooks_reports",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.report?.deposit?.generated_deposit
                      ?.report_deposit_generated_deposit_export_csv
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={"/consult/deposit/deposits_reports/webhooks_reports"}
                  >
                    {t("menus.webhooks_reports")}
                  </Link>
                ),
              ],
              false,
              undefined,
              {
                display: permissions?.report?.deposit?.generated_deposit
                  ?.report_deposit_generated_deposit_export_csv
                  ? undefined
                  : "none",
              }
            ),
          ],
          undefined,
          undefined,
          {
            display: permissions?.report?.deposit?.menu ? undefined : "none",
          }
        ),
        // - CONSULTAS DE SAQUES
        getItem(
          "withdrawals",
          null,
          [
            getItem(
              "generated_withdrawals",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.report?.withdraw?.generated_withdraw?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/consult/withdrawals/generated_withdrawals"}
              >
                {t("menus.generated_withdrawals")}
              </Link>
            ),
            getItem(
              "paid_withdrawals",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.report?.withdraw?.paid_withdraw?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/consult/withdrawals/paid_withdrawals"}
              >
                {t("menus.paid_withdrawals")}
              </Link>
            ),
            getItem(
              "undelivered_withdrawals",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.report?.withdraw?.undelivered_withdraw
                  ?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/consult/withdrawals/undelivered_withdrawals"}
              >
                {t("menus.undelivered_withdrawals")}
              </Link>
            ),

            getItem(
              "withdrawals_reports",
              null,
              [
                getItem(
                  "generated_withdrawals_reports",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.report?.withdraw?.generated_withdraw
                      ?.report_withdraw_generated_withdraw_export_csv
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={
                      "/consult/withdrawals/withdrawals_reports/generated_withdrawals_reports"
                    }
                  >
                    {t("menus.generated_withdrawals_reports")}
                  </Link>
                ),
                getItem(
                  "paid_withdrawals_reports",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.report?.withdraw?.paid_withdraw
                      ?.report_withdraw_paid_withdraw_export_csv
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={
                      "/consult/withdrawals/withdrawals_reports/paid_withdrawals_reports"
                    }
                  >
                    {t("menus.paid_withdrawals_reports")}
                  </Link>
                ),
                getItem(
                  "withdrawals_webhooks_reports",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.report?.withdraw?.generated_withdraw
                      ?.report_withdraw_generated_withdraw_export_csv
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={
                      "/consult/withdrawals/withdrawals_reports/withdrawals_webhooks_reports"
                    }
                  >
                    {t("menus.withdrawals_webhooks_reports")}
                  </Link>
                ),
              ],
              false,
              undefined,
              {
                display: permissions?.report?.withdraw?.generated_withdraw
                  ?.report_withdraw_generated_withdraw_export_csv
                  ? undefined
                  : "none",
              }
            ),
          ],
          undefined,
          undefined,
          {
            display: permissions?.report?.withdraw?.menu ? undefined : "none",
          }
        ),
        // - CONSULTAS DE DEVOLUÇÕES
        getItem(
          "refunds",
          null,
          [
            getItem(
              "refund_deposits",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.report?.chargeback?.deposit_chargeback
                  ?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/consult/refunds/refund_deposits"}
                title={`${t("menus.refund_deposits")}`}
              >
                {t("menus.refund_deposits")}
              </Link>
            ),
            getItem(
              "refund_withdrawals",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.report?.chargeback?.withdraw_chargeback
                  ?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/consult/refunds/refund_withdrawals"}
                title={`${t("menus.refund_withdrawals")}`}
              >
                {t("menus.refund_withdrawals")}
              </Link>
            ),
            getItem(
              "refund_manual_deposits",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.report?.chargeback
                  .manual_deposit_chargeback?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/consult/refunds/refund_manual_deposits"}
                title={`${t("menus.refund_manual_deposits")}`}
              >
                {t("menus.refund_manual_deposits")}
              </Link>
            ),
            getItem(
              "refund_reports",
              null,
              [
                getItem(
                  "refund_deposits_reports",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.report?.chargeback?.deposit_chargeback
                      ?.report_chargeback_deposit_chargeback_export_csv
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={
                      "/consult/refunds/refund_reports/refund_deposits_reports"
                    }
                    title={`${t("menus.refund_deposits_reports")}`}
                  >
                    {t("menus.refund_deposits_reports")}
                  </Link>
                ),
                getItem(
                  "refund_manual_reports",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.report?.chargeback
                      ?.withdraw_chargeback
                      ?.report_chargeback_withdraw_chargeback_export_csv
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={"/consult/refunds/refund_reports/refund_manual_reports"}
                    title={`${t("menus.refund_manual_reports")}`}
                  >
                    {t("menus.refund_manual_reports")}
                  </Link>
                ),
                getItem(
                  "refund_withdrawals_reports",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.report?.chargeback
                      .manual_deposit_chargeback
                      ?.report_chargeback_manual_deposit_chargeback_export_csv
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={
                      "/consult/refunds/refund_reports/refund_withdrawals_reports"
                    }
                    title={`${t("menus.refund_withdrawals_reports")}`}
                  >
                    {t("menus.refund_withdrawals_reports")}
                  </Link>
                ),
              ],
              undefined,
              undefined,
              {
                display: permissions?.report?.chargeback?.deposit_chargeback
                  ?.report_chargeback_deposit_chargeback_export_csv
                  ? undefined
                  : "none",
              }
            ),
          ],
          undefined,
          undefined,
          {
            display: permissions?.report?.chargeback?.menu ? undefined : "none",
          }
        ),
        // - CONSULTAS DE PESSOAS
        getItem(
          "consult_persons",
          null,
          [
            getItem(
              "check_cpf",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.report?.person?.check_cpf?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/consult/consult_persons/check_cpf"}
              >
                {t("menus.check_cpf")}
              </Link>
            ),
            getItem(
              "historic_cpf_merchant",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.report?.person?.check_cpf?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/consult/consult_persons/historic_cpf_merchant"}
                title={`${t("menus.historic_cpf_merchant")}`}
              >
                {t("menus.historic_cpf_merchant")}
              </Link>
            ),
            getItem(
              "SERPRO/ASSERTIVA",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.report?.person?.check_cpf?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/consult/consult_persons/serpro_assertiva"}
              >
                SERPRO / ASSERTIVA
              </Link>
            ),
            getItem(
              "reports",
              null,
              [
                getItem(
                  "historic_cpf_merchant",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.report?.person?.check_cpf?.menu
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={
                      "/consult/consult_persons/reports/historic_cpf_merchant"
                    }
                    title={`${t("menus.historic_cpf_merchant")}`}
                  >
                    {t("menus.historic_cpf_merchant")}
                  </Link>
                ),

                getItem(
                  "historic_cpf_merchant_details",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.report?.person?.check_cpf?.menu
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={
                      "/consult/consult_persons/reports/historic_cpf_merchant_details"
                    }
                    title={`${t("menus.historic_cpf_merchant_details")}`}
                  >
                    {t("menus.historic_cpf_merchant_details")}
                  </Link>
                ),
              ],
              undefined,
              undefined,
              {
                display: permissions?.report?.person?.check_cpf?.menu
                  ? undefined
                  : "none",
              }
            ),
          ],
          undefined,
          undefined,
          {
            display: permissions?.report?.person?.menu ? undefined : "none",
          }
        ),
      ],
      undefined,
      undefined,
      {
        display: permissions?.report?.menu ? undefined : "none",
      }
    ),
    // - SUPORTE
    getItem(
      "support",
      <NotificationOutlined style={{ fontSize: "23px" }} />,
      [
        // - BLACKLISTS
        getItem(
          "blacklists",
          null,
          [
            getItem(
              "bank_institutions",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.support?.blacklist.banks?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/support/blacklists/bank_institutions"}
              >
                {t("menus.bank_institutions")}
              </Link>
            ),
            getItem(
              "third_parties_pix_key",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.support?.blacklist?.third_party_pix_keys
                  ?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/support/blacklists/third_parties_pix_key"}
              >
                {t("menus.third_parties_pix_key")}
              </Link>
            ),
            getItem(
              "invalid_pix_key",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.support?.blacklist?.invalid_pix_keys?.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/support/blacklists/invalid_pix_key"}
              >
                {t("menus.invalid_pix_key")}
              </Link>
            ),
            getItem(
              "blacklists_reports",
              null,
              [
                getItem(
                  "bank_institutions_reports",
                  null,
                  null,
                  false,
                  undefined,
                  {},
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={
                      "/support/blacklists/blacklists_reports/bank_institutions_reports"
                    }
                  >
                    {t("menus.bank_institutions_reports")}
                  </Link>
                ),
              ],
              undefined,
              undefined,
              {
                display: permissions?.support?.blacklist?.banks
                  ?.support_blacklist_bank_export_csv
                  ? undefined
                  : "none",
              }
            ),
          ],
          undefined,
          undefined,
          {
            display: permissions?.support?.blacklist?.menu ? undefined : "none",
          }
        ),

        // - LOGS DE API
        getItem(
          "api_logs",
          null,
          [
            getItem(
              "error_logs_deposits",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.support?.logs?.deposit_error_logs.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/support/api_logs/error_logs_deposits"}
              >
                {t("menus.error_logs_deposits")}
              </Link>
            ),
            getItem(
              "error_logs_withdrawals",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.support?.logs?.withdraw_error_logs.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/support/api_logs/error_logs_withdrawals"}
              >
                {t("menus.error_logs_withdrawals")}
              </Link>
            ),
            getItem(
              "authentication_logs",
              null,
              null,
              false,
              undefined,
              {
                display: permissions?.support?.logs?.auth_logs.menu
                  ? undefined
                  : "none",
              },
              <Link
                onClickCapture={() => {
                  setCollapsed(false);
                  handleChangeSidebar(false);
                }}
                to={"/support/api_logs/authentication_logs"}
              >
                {t("menus.authentication_logs")}
              </Link>
            ),
          ],
          undefined,
          undefined,
          {
            display: permissions?.support?.logs?.menu ? undefined : "none",
          }
        ),

        // - Contestação
        getItem(
          "contestation",
          null,
          [
            getItem(
              "deposit_contestation",
              null,
              [
                getItem(
                  "uploads",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.support?.contestation?.deposits.menu
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={"/support/contestation/deposit_contestation/uploads"}
                  >
                    {t("menus.uploads")}
                  </Link>
                ),
                getItem(
                  "import_csv",
                  null,
                  null,
                  false,
                  undefined,
                  {
                    display: permissions?.support?.contestation?.deposits
                      .import_csv.menu
                      ? undefined
                      : "none",
                  },
                  <Link
                    onClickCapture={() => {
                      setCollapsed(false);
                      handleChangeSidebar(false);
                    }}
                    to={"/support/contestation/deposit_contestation/import_csv"}
                  >
                    {t("menus.import_csv")}
                  </Link>
                ),
              ],
              undefined,
              undefined,
              {
                display:
                  permissions?.support?.contestation?.deposits?.menu &&
                  (type === 1 || type === 2)
                    ? undefined
                    : "none",
              }
            ),
          ],
          undefined,
          undefined,
          {
            display:
              permissions?.support?.contestation?.deposits?.menu &&
              (type === 1 || type === 2)
                ? undefined
                : "none",
          }
        ),
        /*  getItem("Wiki", null, null, false, () => {
          window.open("https://wiki-v4.paybrokers.info/");
        }), */
      ],
      undefined,
      undefined,
      {
        display: permissions?.support?.menu ? undefined : "none",
      }
    ),
  ];

  useEffect(() => {
    setItems(i);
  }, [translation]);

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
    >
      <Tour open={isMenuTourOpen} onClose={() => setIsMenuTourOpen(true)} />
      <motion.div
        whileHover={{ filter: "contrast(130%)" }}
        whileTap={{ filter: "contrast(100%)" }}
      >
        <Button
          type={isMobile && !isSidebarOpen ? "ghost" : "primary"}
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
                : defaultTheme.colors.primary,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderBottom: isMobile
              ? "none"
              : theme === "light"
              ? "1px solid #797979ac"
              : "1px solid #4b4b4bac",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {isSidebarOpen && (
              <img
                src={import.meta.env.VITE_APP_LOGO || PbLogo}
                style={{ width: "180px", marginLeft: "-24px" }}
              />
            )}
            {!isSidebarOpen ? (
              <MenuUnfoldOutlined
                style={{
                  fontSize: "26px",

                  color:
                    !isSidebarOpen && isMobile && theme === "light"
                      ? "#000"
                      : import.meta.env.VITE_APP_MENU_THEME === "dark"
                      ? "#fff"
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
                      : import.meta.env.VITE_APP_MENU_THEME === "dark"
                      ? "#fff"
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
          backgroundColor:
            theme === "dark" ? "#222222" : defaultTheme.colors.primary,
          display: isMobile && !isSidebarOpen ? "none" : "inherit",
        }}
        openKeys={isSidebarOpen ? openKeys : undefined}
        selectedKeys={[active]}
        onOpenChange={isSidebarOpen ? onOpenChange : undefined}
        disabledOverflow
        translate="yes"
        mode="inline"
        theme={theme === "dark" ? "light" : import.meta.env.VITE_APP_MENU_THEME}
        inlineCollapsed={!isSidebarOpen}
        items={items}
      />
      {(!isMobile || isSidebarOpen) && (
        <motion.div
          whileHover={{ filter: "contrast(130%)" }}
          whileTap={{ filter: "contrast(100%)" }}
        >
          <Button
            type={isMobile && !isSidebarOpen ? "ghost" : "primary"}
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
