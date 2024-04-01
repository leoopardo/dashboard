import { Grid } from "@mui/material";
import { queryClient } from "@src/services/queryClient";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Tabs, TabsProps, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { BanksTab } from "./tabs/banks";
import { CredentialConfigTab } from "./tabs/credentials";
import { FeesTab } from "./tabs/fees";
import { IpsConfigTab } from "./tabs/ips";
import { MerchantConfigTab } from "./tabs/merchantConfigTab";
import { OrganizationConfigTab } from "./tabs/organizationConfigTab";
import { setFirstChildDivTestId } from "@src/utils/functions";
import { useEffect } from "react";
import { AccountTab } from "./tabs/account";

export const MerchantConfigs = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;

  const { t } = useTranslation();
  const location = useLocation();
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onChange = () => {};

  const tabBanks = document.querySelector('[data-node-key="1"]');
  const tabFees = document.querySelector('[data-node-key="2"]');
  const tabMerchantConfig = document.querySelector('[data-node-key="3"]');
  const tabOrganizationConfig = document.querySelector('[data-node-key="4"]');
  const tabCredential = document.querySelector('[data-node-key="5"]');
  const tabIps = document.querySelector('[data-node-key="6"]');

  const initialTab = () => {
    if (!permissions?.register?.merchant?.merchant?.merchant_config_banks) {
      if (!permissions?.register?.merchant?.merchant?.merchant_config_fees) {
        if (
          !permissions?.register?.merchant?.merchant?.merchant_config_merchant
        ) {
          if (
            !permissions?.register?.merchant?.merchant
              ?.merchant_config_paybrokers
          ) {
            if (
              !permissions?.register?.merchant?.merchant?.merchant_config_ips
            ) {
              setFirstChildDivTestId(tabIps, "tab-ips");
              return "6";
            }
            setFirstChildDivTestId(tabCredential, "tab-credential");
            return "5";
          }
          setFirstChildDivTestId(
            tabOrganizationConfig,
            "tab-organization-config"
          );
          return "4";
        }
        setFirstChildDivTestId(tabMerchantConfig, "tab-merchant-config");
        return "3";
      }
      setFirstChildDivTestId(tabFees, "tab-fees");
      return "2";
    }
    setFirstChildDivTestId(tabBanks, "tab-banks");
    return "1";
  };

  const initialItems = (items: TabsProps["items"]) => {
    const currentItems = items?.filter(
      (item) => item?.style?.display !== "none"
    );

    return currentItems;
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `${t("table.bank")}s`,
      children: <BanksTab id={location?.state?.id} />,
      style: {
        display: permissions?.register?.merchant?.merchant
          ?.merchant_config_banks
          ? undefined
          : "none",
      },
      disabled:
        !permissions?.register?.merchant?.merchant?.merchant_config_banks,
    },
    {
      key: "2",
      label: `${t("table.fee")}s`,
      children: <FeesTab id={location?.state?.id} />,
      style: {
        display: permissions?.register?.merchant?.merchant?.merchant_config_fees
          ? undefined
          : "none",
      },
      disabled:
        !permissions?.register?.merchant?.merchant?.merchant_config_fees,
    },
    {
      key: "3",
      label: t("menus.current_accounts"),
      children: <AccountTab id={location?.state?.id} />,
      style: {
        display: permissions?.register?.merchant?.merchant
          ?.merchant_account_api_update
          ? undefined
          : "none",
      },
      disabled:
        !permissions?.register?.merchant?.merchant?.merchant_account_api_update,
    },
    {
      key: "4",
      label: t("menus.merchant_settings"),
      children: <MerchantConfigTab id={location?.state?.id} />,
      style: {
        display: permissions?.register?.merchant?.merchant
          ?.merchant_config_merchant
          ? undefined
          : "none",
      },
      disabled:
        !permissions?.register?.merchant?.merchant?.merchant_config_merchant,
    },
    {
      key: "5",
      label: t("menus.organization_settings"),
      children: <OrganizationConfigTab id={location?.state?.id} />,
      style: {
        display: permissions?.register?.merchant?.merchant
          ?.merchant_config_paybrokers
          ? undefined
          : "none",
      },
      disabled:
        !permissions?.register?.merchant?.merchant?.merchant_config_paybrokers,
    },
    {
      key: "6",
      label: `${t("menus.credentials")}`,
      children: <CredentialConfigTab id={location?.state?.id} />,
      style: {
        display: permissions?.register?.merchant?.merchant
          ?.merchant_config_credentials
          ? undefined
          : "none",
      },
      disabled:
        !permissions?.register?.merchant?.merchant?.merchant_config_credentials,
    },
    {
      key: "7",
      label: "IPs",
      children: <IpsConfigTab id={location?.state?.id} />,
      style: {
        display: permissions?.register?.merchant?.merchant?.merchant_config_ips
          ? undefined
          : "none",
      },
      disabled: !permissions?.register?.merchant?.merchant?.merchant_config_ips,
    },
  ];

  useEffect(() => {
    setFirstChildDivTestId(tabBanks, "tab-banks");
    setFirstChildDivTestId(tabFees, "tab-fees");
    setFirstChildDivTestId(tabMerchantConfig, "tab-merchant-config");
    setFirstChildDivTestId(tabOrganizationConfig, "tab-organization-config");
    setFirstChildDivTestId(tabCredential, "tab-credential");
    setFirstChildDivTestId(tabIps, "tab-ips");
  }, [
    tabBanks,
    tabFees,
    tabMerchantConfig,
    tabOrganizationConfig,
    tabCredential,
    tabIps,
    location?.state,
    location,
  ]);

  return (
    <Grid
      container
      style={{
        padding: "25px",
        display: "flex",
      }}
    >
      <Grid item xs={12}>
        <Typography.Title
          style={{ textTransform: "capitalize" }}
          level={4}
        >{`${t("input.merchant_id")}: ${
          location.state.name
        }`}</Typography.Title>
      </Grid>
      <Grid item xs={12}>
        <Tabs
          defaultActiveKey={initialTab()}
          items={initialItems(items)}
          onChange={onChange}
          itemID="teste-data-id"
        />
      </Grid>
    </Grid>
  );
};
