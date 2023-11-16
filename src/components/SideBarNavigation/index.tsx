/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DollarOutlined,
  FileSearchOutlined,
  FolderAddOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import { useTheme } from "@src/contexts/ThemeContext";
import { queryClient } from "@src/services/queryClient";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Button, Menu, MenuProps, Tour } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { useLocation, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { useMenu } from "../../contexts/SidebarContext";
import { useErrorContext } from "@src/contexts/ErrorContext";
import { defaultTheme } from "../../styles/defaultTheme";

type MenuItem = Required<MenuProps>["items"][number];

export const SidebarNavigation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {resetErrors} = useErrorContext()
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
    label?: React.ReactNode,
    theme?: string
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
    } as MenuItem;
  }

  const i: MenuItem[] = [
    getItem(
      "dashboard",
      null,
      null,
      false,
      () => navigate("/dashboard"),
      { fontSize: "16px" },
      import.meta.env.VITE_APP_COMPANY_NAME,
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
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.register?.paybrokers?.users?.menu
                  ? undefined
                  : "none",
              }
            ),
            getItem(
              "categories",
              null,
              null,
              false,
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.register?.paybrokers?.release_category
                  ?.menu
                  ? undefined
                  : "none",
              }
            ),
            getItem(
              "bank_maintain",
              null,
              null,
              false,
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.register?.paybrokers?.banks_maintain?.menu
                  ? undefined
                  : "none",
              }
            ),
            getItem(
              "general_configs",
              null,
              null,
              false,
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.register?.paybrokers?.general_configs
                  ?.menu
                  ? undefined
                  : "none",
              }
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
                  (e) => handleNavigate(e?.keyPath),
                  {
                    display: permissions?.register?.paybrokers?.users
                      ?.paybrokers_user_export_csv
                      ? undefined
                      : "none",
                  }
                ),
                getItem(
                  "organization_reports_categories",
                  null,
                  null,
                  false,
                  (e) => handleNavigate(e?.keyPath),
                  {
                    display: permissions?.register?.paybrokers?.release_category
                      ?.paybrokers_release_category_export_csv
                      ? undefined
                      : "none",
                  }
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
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.register?.aggregator?.aggregator?.menu
                  ? undefined
                  : "none",
              }
            ),
            getItem(
              "aggregator_users",
              null,
              null,
              false,
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.register?.aggregator?.users?.menu
                  ? undefined
                  : "none",
              }
            ),
            getItem(
              "self_exclusion",
              null,
              null,
              false,
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.register?.aggregator?.self_exclusion?.menu
                  ? undefined
                  : "none",
              }
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
                  (e) => handleNavigate(e?.keyPath),
                  {
                    display: permissions?.register?.aggregator?.aggregator
                      ?.aggregator_export_csv
                      ? undefined
                      : "none",
                  }
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
                  (e) => handleNavigate(e?.keyPath),
                  {
                    display: permissions?.register?.aggregator?.aggregator
                      ?.aggregator_export_csv
                      ? undefined
                      : "none",
                  }
                ),
                getItem(
                  "aggregator_users_reports",
                  null,
                  null,
                  false,
                  (e) => handleNavigate(e?.keyPath),
                  {
                    display: permissions?.register?.aggregator?.users
                      ?.aggregator_user_export_csv
                      ? undefined
                      : "none",
                  }
                ),
                getItem(
                  "aggregator_blacklist_reports",
                  null,
                  null,
                  false,
                  (e) => handleNavigate(e?.keyPath),
                  {
                    display: permissions?.register?.aggregator?.blacklist
                      .aggregator_blacklist_export_csv
                      ? undefined
                      : "none",
                  }
                ),
                getItem(
                  "self_exclusion_reports",
                  null,
                  null,
                  false,
                  (e) => handleNavigate(e?.keyPath),
                  {
                    display: permissions?.register?.aggregator?.self_exclusion
                      .aggregator_self_exclusion_export_csv
                      ? undefined
                      : "none",
                  }
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
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.register?.partner?.partner?.menu
                  ? undefined
                  : "none",
              }
            ),
            getItem(
              "partner_users",
              null,
              null,
              false,
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.register?.partner?.users?.menu
                  ? undefined
                  : "none",
              }
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
                  (e) => handleNavigate(e?.keyPath),
                  {
                    display: permissions?.register?.partner?.partner
                      ?.partner_export_csv
                      ? undefined
                      : "none",
                  }
                ),
                getItem(
                  "partner_users_reports",
                  null,
                  null,
                  false,
                  (e) => handleNavigate(e?.keyPath),
                  {
                    display: permissions?.register?.partner?.users
                      ?.partner_user_export_csv
                      ? undefined
                      : "none",
                  }
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
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.register?.operator?.operator?.menu
                  ? undefined
                  : "none",
              }
            ),
            getItem(
              "operator_users",
              null,
              null,
              false,
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.register?.operator?.users?.menu
                  ? undefined
                  : "none",
              }
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
                  (e) => handleNavigate(e?.keyPath),
                  {
                    display: permissions?.register?.operator?.operator
                      ?.operator_export_csv
                      ? undefined
                      : "none",
                  }
                ),
                getItem(
                  "operator_users_reports",
                  null,
                  null,
                  false,
                  (e) => handleNavigate(e?.keyPath),
                  {
                    display: permissions?.register?.operator?.users
                      ?.operator_user_export_csv
                      ? undefined
                      : "none",
                  }
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
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.register?.merchant?.merchant?.menu
                  ? undefined
                  : "none",
              }
            ),
            getItem(
              "merchant_users",
              null,
              null,
              false,
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.register?.merchant?.users?.menu
                  ? undefined
                  : "none",
              }
            ),
            // getItem(
            //   "manual_entry_category",
            //   null,
            //   null,
            //   false,
            //   (e) => handleNavigate(e?.keyPath),
            //   {
            //     display: permissions?.register?.merchant?.release_category?.menu
            //       ? undefined
            //       : "none",
            //   }
            // ),
            getItem(
              "fee_plans",
              null,
              null,
              false,
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.register?.merchant?.fee_plans?.menu
                  ? undefined
                  : "none",
              }
            ),
            getItem("merchant_blacklists", null, [
              getItem(
                "merchant_blacklist",
                null,
                null,
                false,
                (e) => handleNavigate(e?.keyPath),
                {
                  display: permissions?.register?.merchant?.blacklist?.menu
                    ? undefined
                    : "none",
                }
              ),
              getItem(
                "import_merchant_blacklist",
                null,
                null,
                false,
                (e) => handleNavigate(e?.keyPath),
                {
                  display: permissions?.register?.merchant?.blacklist
                    ?.merchant_blacklist_create
                    ? undefined
                    : "none",
                }
              ),
              getItem(
                "uploads_merchant_blacklist",
                null,
                null,
                false,
                (e) => handleNavigate(e?.keyPath),
                {
                  display: permissions?.register?.merchant?.blacklist
                    ?.merchant_blacklist_create
                    ? undefined
                    : "none",
                }
              ),
              getItem(
                "merchant_blacklist_reasons",
                null,
                null,
                false,
                (e) => handleNavigate(e?.keyPath),
                {
                  display: permissions?.register?.merchant?.black_list_reason
                    .menu
                    ? undefined
                    : "none",
                }
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
                  (e) => handleNavigate(e?.keyPath),
                  {
                    display: permissions?.register?.merchant?.merchant
                      ?.merchant_export_csv
                      ? undefined
                      : "none",
                  }
                ),
                getItem(
                  "merchant_users_reports",
                  null,
                  null,
                  false,
                  (e) => handleNavigate(e?.keyPath),
                  {
                    display: permissions?.register?.merchant?.users
                      ?.merchant_user_export_csv
                      ? undefined
                      : "none",
                  }
                ),
                getItem(
                  "merchant_blacklist_reports",
                  null,
                  null,
                  false,
                  (e) => handleNavigate(e?.keyPath),
                  {
                    display: permissions?.register?.merchant?.blacklist
                      .merchant_blacklist_export_csv
                      ? undefined
                      : "none",
                  }
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
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.register?.person?.person?.menu
                  ? undefined
                  : "none",
              }
            ),
            // getItem(
            //   "whitelist",
            //   null,
            //   null,
            //   false,
            //   (e) => handleNavigate(e?.keyPath),
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
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.register?.person?.client_banks?.menu
                  ? undefined
                  : "none",
              }
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
                  (e) => handleNavigate(e?.keyPath),
                  {
                    display: permissions?.register?.person?.person?.menu
                      ? undefined
                      : "none",
                  }
                ),
                getItem(
                  "person_blacklist_uploads",
                  null,
                  null,
                  false,
                  (e) => handleNavigate(e?.keyPath),
                  {
                    display: permissions?.register?.person?.person?.menu
                      ? undefined
                      : "none",
                  }
                ),
                getItem(
                  "person_blacklist_reasons",
                  null,
                  null,
                  false,
                  (e) => handleNavigate(e?.keyPath),
                  {
                    display: permissions?.register?.person?.person?.menu
                      ? undefined
                      : "none",
                  }
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
                  (e) => handleNavigate(e?.keyPath),
                  {
                    display: permissions?.register?.person?.person
                      ?.person_person_export_csv
                      ? undefined
                      : "none",
                  }
                ),
                getItem(
                  "client_bank_reports",
                  null,
                  null,
                  false,
                  (e) => handleNavigate(e?.keyPath),
                  {
                    display: permissions?.register?.person?.client_banks
                      ?.person_client_banks_export_csv
                      ? undefined
                      : "none",
                  }
                ),
                // getItem(
                //   "pix_whitelist_reports",
                //   null,
                //   null,
                //   false,
                //   (e) => handleNavigate(e?.keyPath),
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
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.transactions?.paybrokers
                  ?.manual_transactions?.menu
                  ? undefined
                  : "none",
              }
            ),
            //ajustar permissões
            getItem(
              "organization_transfer_between_accounts",
              null,
              null,
              false,
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.transactions?.paybrokers
                  ?.manual_transactions?.menu
                  ? undefined
                  : "none",
              }
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
                  (e) => handleNavigate(e?.keyPath),
                  {
                    display: permissions?.transactions?.paybrokers
                      ?.manual_transactions
                      ?.paybrokers_manual_transactions_export_csv
                      ? undefined
                      : "none",
                  }
                ),
                //ajustar permisssões
                getItem(
                  "organization_transfer_between_accounts_reports",
                  null,
                  null,
                  false,
                  (e) => handleNavigate(e?.keyPath),
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
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.transactions?.paybrokers
                  ?.manual_transactions?.menu
                  ? undefined
                  : "none",
              }
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
                  (e) => handleNavigate(e?.keyPath),
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
              (e) => handleNavigate(e?.keyPath),
              {
                display:
                  permissions?.transactions?.merchant?.manual_transactions
                    ?.menu
                    ? undefined
                    : "none",
              }
            ),

            //ajustar permissões
            getItem(
              "between_accounts_transfers",
              null,
              null,
              false,
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.transactions?.merchant
                  ?.manual_transactions?.menu
                  ? undefined
                  : "none",
              }
            ),
            getItem(
              "merchant_pre_manual_moviments",
              null,
              null,
              false,
              (e) => handleNavigate(e?.keyPath),
              {
                display:
                  permissions?.transactions?.merchant?.merchant_pre_manual
                    ?.menu
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
                  (e) => handleNavigate(e?.keyPath),
                  {
                    display: permissions?.transactions?.merchant
                      ?.manual_transactions
                      ?.merchant_manual_transactions_export_csv
                      ? undefined
                      : "none",
                  }
                ),
                getItem(
                  "merchant_between_accounts_reports",
                  null,
                  null,
                  false,
                  (e) => handleNavigate(e?.keyPath),
                  {
                    display: permissions?.transactions?.merchant
                      ?.manual_transactions
                      ?.merchant_manual_transactions_export_csv
                      ? undefined
                      : "none",
                  }
                ),
                //TODO arrumar permissão Reports Pre manual
                getItem(
                  "merchant_pre_manual_moviments_reports",
                  null,
                  null,
                  false,
                  (e) => handleNavigate(e?.keyPath),
                  {
                    display: permissions?.transactions?.merchant
                      ?.merchant_pre_manual
                      ?.menu
                      ? undefined
                      : "none",
                  }
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
          (e) => handleNavigate(e?.keyPath),
          {
            display: type !== 3 ? undefined : "none",
          }
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
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.report?.paybrokers?.extract?.menu
                  ? undefined
                  : "none",
              }
            ),
            getItem(
              "organization_balance",
              null,
              null,
              false,
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.report?.paybrokers?.balance?.menu
                  ? undefined
                  : "none",
              }
            ),
            getItem(
              "organization_bank_balance",
              null,
              null,
              false,
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.report?.paybrokers?.extract?.menu
                  ? undefined
                  : "none",
              }
            ),
            getItem(
              "organization_history",
              null,
              null,
              false,
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.report?.paybrokers?.bank_history?.menu
                  ? undefined
                  : "none",
              }
            ),
            getItem(
              "consult_organization_reports",
              null,
              null,
              false,
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.report?.paybrokers?.extract
                  ?.report_paybrokers_extract_export_csv
                  ? undefined
                  : "none",
              }
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
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.report?.merchant?.extract?.menu
                  ? undefined
                  : "none",
              }
            ),
            getItem(
              "merchant_balance",
              null,
              null,
              false,
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.report?.merchant?.balance?.menu
                  ? undefined
                  : "none",
              }
            ),
            getItem(
              "merchant_history",
              null,
              null,
              false,
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.report?.merchant?.balance_history?.menu
                  ? undefined
                  : "none",
              }
            ),
            getItem(
              "consult_merchant_reports",
              null,
              null,
              false,
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.report?.merchant?.extract
                  ?.report_merchant_extract_export_csv
                  ? undefined
                  : "none",
              }
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
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.report?.deposit?.generated_deposit?.menu
                  ? undefined
                  : "none",
              }
            ),
            getItem(
              "paid_deposits",
              null,
              null,
              false,
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.report?.deposit?.paid_deposit?.menu
                  ? undefined
                  : "none",
              }
            ),
            getItem(
              "undelivered_deposits",
              null,
              null,
              false,
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.report?.deposit?.undelivered_deposit?.menu
                  ? undefined
                  : "none",
              }
            ),
            getItem(
              "receipts",
              null,
              null,
              false,
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.report?.deposit?.deposit_receipt?.menu
                  ? undefined
                  : "none",
              }
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
                  (e) => handleNavigate(e?.keyPath),
                  {
                    display: permissions?.report?.deposit?.generated_deposit
                      ?.report_deposit_generated_deposit_export_csv
                      ? undefined
                      : "none",
                  }
                ),
                getItem(
                  "paid_deposits_reports",
                  null,
                  null,
                  false,
                  (e) => handleNavigate(e?.keyPath),
                  {
                    display: permissions?.report?.deposit?.paid_deposit
                      ?.report_deposit_paid_deposit_export_csv
                      ? undefined
                      : "none",
                  }
                ),
                getItem(
                  "webhooks_reports",
                  null,
                  null,
                  false,
                  (e) => handleNavigate(e?.keyPath),
                  {
                    display: permissions?.report?.deposit?.generated_deposit
                      ?.report_deposit_generated_deposit_export_csv
                      ? undefined
                      : "none",
                  }
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
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.report?.withdraw?.generated_withdraw?.menu
                  ? undefined
                  : "none",
              }
            ),
            getItem(
              "paid_withdrawals",
              null,
              null,
              false,
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.report?.withdraw?.paid_withdraw?.menu
                  ? undefined
                  : "none",
              }
            ),
            getItem(
              "undelivered_withdrawals",
              null,
              null,
              false,
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.report?.withdraw?.undelivered_withdraw
                  ?.menu
                  ? undefined
                  : "none",
              }
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
                  (e) => handleNavigate(e?.keyPath),
                  {
                    display: permissions?.report?.withdraw?.generated_withdraw
                      ?.report_withdraw_generated_withdraw_export_csv
                      ? undefined
                      : "none",
                  }
                ),
                getItem(
                  "paid_withdrawals_reports",
                  null,
                  null,
                  false,
                  (e) => handleNavigate(e?.keyPath),
                  {
                    display: permissions?.report?.withdraw?.paid_withdraw
                      ?.report_withdraw_paid_withdraw_export_csv
                      ? undefined
                      : "none",
                  }
                ),
                getItem(
                  "withdrawals_webhooks_reports",
                  null,
                  null,
                  false,
                  (e) => handleNavigate(e?.keyPath),
                  {
                    display: permissions?.report?.withdraw?.generated_withdraw
                      ?.report_withdraw_generated_withdraw_export_csv
                      ? undefined
                      : "none",
                  }
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
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.report?.chargeback?.deposit_chargeback
                  ?.menu
                  ? undefined
                  : "none",
              }
            ),
            getItem(
              "refund_withdrawals",
              null,
              null,
              false,
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.report?.chargeback?.withdraw_chargeback
                  ?.menu
                  ? undefined
                  : "none",
              }
            ),
            getItem(
              "refund_manual_deposits",
              null,
              null,
              false,
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.report?.chargeback
                  .manual_deposit_chargeback?.menu
                  ? undefined
                  : "none",
              }
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
                  (e) => handleNavigate(e?.keyPath),
                  {
                    display: permissions?.report?.chargeback?.deposit_chargeback
                      ?.report_chargeback_deposit_chargeback_export_csv
                      ? undefined
                      : "none",
                  }
                ),
                getItem(
                  "refund_manual_reports",
                  null,
                  null,
                  false,
                  (e) => handleNavigate(e?.keyPath),
                  {
                    display: permissions?.report?.chargeback
                      ?.withdraw_chargeback
                      ?.report_chargeback_withdraw_chargeback_export_csv
                      ? undefined
                      : "none",
                  }
                ),
                getItem(
                  "refund_withdrawals_reports",
                  null,
                  null,
                  false,
                  (e) => handleNavigate(e?.keyPath),
                  {
                    display: permissions?.report?.chargeback
                      .manual_deposit_chargeback
                      ?.report_chargeback_manual_deposit_chargeback_export_csv
                      ? undefined
                      : "none",
                  }
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
              (e) => handleNavigate(e?.keyPath),
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
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.support?.blacklist.banks?.menu
                  ? undefined
                  : "none",
              }
            ),
            getItem(
              "third_parties_pix_key",
              null,
              null,
              false,
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.support?.blacklist?.third_party_pix_keys
                  ?.menu
                  ? undefined
                  : "none",
              }
            ),
            getItem(
              "invalid_pix_key",
              null,
              null,
              false,
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.support?.blacklist?.invalid_pix_keys?.menu
                  ? undefined
                  : "none",
              }
            ),
            getItem(
              "blacklists_reports",
              null,
              [
                getItem("bank_institutions_reports", null, null, false, (e) =>
                  handleNavigate(e?.keyPath)
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
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.support?.logs?.deposit_error_logs.menu
                  ? undefined
                  : "none",
              }
            ),
            getItem(
              "error_logs_withdrawals",
              null,
              null,
              false,
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.support?.logs?.withdraw_error_logs.menu
                  ? undefined
                  : "none",
              }
            ),
            getItem(
              "authentication_logs",
              null,
              null,
              false,
              (e) => handleNavigate(e?.keyPath),
              {
                display: permissions?.support?.logs?.auth_logs.menu
                  ? undefined
                  : "none",
              }
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
                getItem("uploads", null, null, false, (e) =>
                  handleNavigate(e?.keyPath)
                ),
                getItem("import_csv", null, null, false, (e) =>
                  handleNavigate(e?.keyPath)
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
    getItem(
      "logout",
      <LogoutOutlined style={{ fontSize: "23px" }} />,
      null,
      false,
      () => {
        secureLocalStorage.removeItem("token");
        sessionStorage.removeItem("token");
        queryClient.refetchQueries(["validate"]);
        resetErrors()
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
      <Tour open={isMenuTourOpen} onClose={() => setIsMenuTourOpen(true)} />
      <Button
        type={isMobile && !isSidebarOpen ? "ghost" : "primary"}
        onClick={toggleCollapsed}
        style={{
          height: "55px",
          width: isSidebarOpen ? 256 : 80,
          borderRadius: 0,
        }}
      >
        {!isSidebarOpen ? (
          <MenuUnfoldOutlined
            style={{
              fontSize: "26px",
              color: theme === "dark" ? "#fff" : "#000",
            }}
          />
        ) : (
          <MenuFoldOutlined
            style={{
              fontSize: "26px",
              color: theme === "dark" ? "#fff" : "#000",
            }}
          />
        )}
      </Button>

      <Menu
        style={{
          minHeight: "100%",
          maxHeight: "100%",
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
        theme={theme === "dark" ? "dark" : import.meta.env.VITE_APP_MENU_THEME}
        inlineCollapsed={!isSidebarOpen}
        items={items}
      />
    </div>
  );
};
