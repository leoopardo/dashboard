import { Grid } from "@mui/material";
import { Tabs, TabsProps } from "antd";
import { BanksTab } from "./tabs/banks";
import { FeesTab } from "./tabs/fees";
import { MerchantConfigTab } from "./tabs/merchantConfigTab";
import { OrganizationConfigTab } from "./tabs/organizationConfigTab";
import { CredentialConfigTab } from "./tabs/credentials";
import { IpsConfigTab } from "./tabs/ips";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { queryClient } from "@src/services/queryClient";
import { ValidateInterface } from "@src/services/types/validate.interface";

export const MerchantConfigs = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;

  const { t } = useTranslation();
  const params = useParams();
  const onChange = (key: string) => {
    console.log(key);
  };

  const initialTab = () => {
    if (!permissions.register.merchant.merchant.merchant_config_banks) {
      return "2";
    }
    if (!permissions.register.merchant.merchant.merchant_config_fees) {
      return "3";
    }
    if (!permissions.register.merchant.merchant.merchant_config_merchant) {
      return "4";
    }
    if (!permissions.register.merchant.merchant.merchant_config_paybrokers) {
      return "5";
    }
    if (!permissions.register.merchant.merchant.merchant_config_ips) {
      return "6";
    }

    return "1";
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `${t("table.bank")}s`,
      children: <BanksTab id={params.id} />,
      style: {
        display: permissions.register.merchant.merchant.merchant_config_banks
          ? undefined
          : "none",
      },
      disabled: !permissions.register.merchant.merchant.merchant_config_banks,
    },
    {
      key: "2",
      label: `${t("table.fee")}s`,
      children: <FeesTab id={params.id} />,
      style: {
        display: permissions.register.merchant.merchant.merchant_config_fees
          ? undefined
          : "none",
      },
      disabled: !permissions.register.merchant.merchant.merchant_config_fees,
    },
    {
      key: "3",
      label: `${t("table.merchant_name")} Configs`,
      children: <MerchantConfigTab id={params.id} />,
      style: {
        display: permissions.register.merchant.merchant.merchant_config_merchant
          ? undefined
          : "none",
      },
      disabled:
        !permissions.register.merchant.merchant.merchant_config_merchant,
    },
    {
      key: "4",
      label: `${t("menus.organization")} Configs`,
      children: <OrganizationConfigTab id={params.id} />,
      style: {
        display: permissions.register.merchant.merchant
          .merchant_config_paybrokers
          ? undefined
          : "none",
      },
      disabled:
        !permissions.register.merchant.merchant.merchant_config_paybrokers,
    },
    {
      key: "5",
      label: `${t("menus.credentials")}`,
      children: <CredentialConfigTab id={params.id} />,
      style: {
        display: permissions.register.merchant.merchant
          .merchant_config_credentials
          ? undefined
          : "none",
      },
      disabled:
        !permissions.register.merchant.merchant.merchant_config_credentials,
    },
    {
      key: "6",
      label: "IPs",
      children: <IpsConfigTab id={params.id} />,
      style: {
        display: permissions.register.merchant.merchant.merchant_config_ips
          ? undefined
          : "none",
      },
      disabled: !permissions.register.merchant.merchant.merchant_config_ips,
    },
  ];

  return (
    <Grid
      container
      style={{
        padding: "25px",
        display: "flex",
      }}
    >
      <Grid item xs={12}>
        <Tabs
          defaultActiveKey={initialTab()}
          items={items}
          onChange={onChange}
        />
      </Grid>
    </Grid>
  );
};
