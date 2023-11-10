import { Grid } from "@mui/material";
import { queryClient } from "@src/services/queryClient";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Tabs, TabsProps } from "antd";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { BanksTab } from "./tabs/banks";
import { CredentialConfigTab } from "./tabs/credentials";
import { FeesTab } from "./tabs/fees";
import { IpsConfigTab } from "./tabs/ips";
import { MerchantConfigTab } from "./tabs/merchantConfigTab";
import { OrganizationConfigTab } from "./tabs/organizationConfigTab";

export const MerchantConfigs = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;

  const { t } = useTranslation();
  const params = useParams();
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onChange = () => {};

  const initialTab = () => {
    if (!permissions.register.merchant.merchant.merchant_config_banks) {
      if (!permissions.register.merchant.merchant.merchant_config_fees) {
        if (!permissions.register.merchant.merchant.merchant_config_merchant) {
          if (
            !permissions.register.merchant.merchant.merchant_config_paybrokers
          ) {
            if (!permissions.register.merchant.merchant.merchant_config_ips) {
              return "6";
            }
            return "5";
          }
          return "4";
        }
        return "3";
      }
      return "2";
    }

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
          items={initialItems(items)}
          onChange={onChange}
        />
      </Grid>
    </Grid>
  );
};
