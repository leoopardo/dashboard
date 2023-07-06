import { Grid } from "@mui/material";
import {

  Tabs,
  TabsProps,
} from "antd";
import { BanksTab } from "./tabs/banks";
import { FeesTab } from "./tabs/fees";
import { MerchantConfigTab } from "./tabs/merchantConfigTab";
import { OrganizationConfigTab } from "./tabs/organizationConfigTab";
import { CredentialConfigTab } from "./tabs/credentials";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export const MerchantConfigs = () => {
  const { t } = useTranslation();
  const params = useParams()
  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label:`${t("table.bank")}s`,
      children: (
         <BanksTab id={params.id} />
      ),
    },
    {
      key: "2",
      label:`${t("table.fee")}s`,
      children: (
        <FeesTab id={params.id}/>
      ),
    }, 
    {
      key: "3",
      label:`${t("table.merchant_name")} Configs`,
      children: (
        <MerchantConfigTab id={params.id}/>
      ),
    }, 
    {
      key: "4",
      label:`${t("menus.organization")} Configs`,
      children: (
        <OrganizationConfigTab id={params.id}/>
      ),
    }, 
    {
      key: "5",
      label:`${t("menus.credentials")}`,
      children: (
        <CredentialConfigTab id={params.id}/>
      ),
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
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </Grid>
  </Grid>
  );
};
