import { useRef, useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { Toast } from "@src/components/Toast";
import { useMerchantBankConfig } from "@src/services/register/merchant/merchant/bankConfig/getBankConfig";
import { useUpdateOrganizationGeneralConfigs } from "@src/services/register/organization/generalConfigs/updateGeneralConfigs";
import {
  Button,
  Form,
  FormInstance,
  Input,
  Popconfirm,
  Select,
  Tabs,
  TabsProps,
} from "antd";
import { MerchantBankResponse } from "@src/services/types/register/merchants/merchantBankConfig";
import { BanksTab } from "./tabs/banks";
import { FeesTab } from "./tabs/fees";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export const MerchantConfigs = () => {
  const { t } = useTranslation();
  const params = useParams()
  const { isMerchantBankFetching, merchantBankData, merchantBankError } =
    useMerchantBankConfig(params?.id || '');
  const onChange = (key: string) => {
    console.log(key);
  };
  const formRef = useRef<FormInstance>(null);
  const [body, setBody] = useState<MerchantBankResponse | null>(merchantBankData || null);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
/*   const { updateMutate, updateError, updateIsLoading, updateSuccess } =
    useUpdateOrganizationGeneralConfigs(body); */
 /*  const handleChange = (event: any) => {
    setBody((state) => ({
      ...state,
      [event.target.name]: Number(event.target.value),
    }));
  }; */

/*   useEffect(() => {
    formRef.current?.setFieldsValue(data);
  }, [data]); */

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
    {/* <Grid
        item
        container
        xs={12}
        style={{ display: "flex", flexDirection: "row-reverse" }}
      >
        <Grid item xs={12} md={4} lg={2}>
          <Popconfirm
            title={t("messages.confirm_action_title", {
              action: t("messages.update"),
            })}
            description={t("messages.are_you_sure", {
              action: t("messages.update"),
              itens: t("menus.general_configs").toLowerCase(),
            })}
            open={isConfirmOpen}
            style={{ maxWidth: "340px" }}
            onConfirm={() => {
             // updateMutate();
              setIsConfirmOpen(false);
            }}
            okButtonProps={{ loading: updateIsLoading }}
            okText={t("messages.yes_update")}
            cancelText={t("messages.no_cancel")}
            onCancel={() => setIsConfirmOpen(false)}
          >
            <Button
              size="large"
              type="primary"
              style={{ width: "100%" }}
              loading={isFetching || updateIsLoading}
              onClick={() => setIsConfirmOpen(true)}
            >
              {t("buttons.update_general_configs")}
            </Button>
          </Popconfirm>
        </Grid>
      </Grid>
    <Toast
      actionSuccess={t("messages.updated")}
      actionError={t("messages.update")}
      error={updateError}
      success={updateSuccess}
    /> */}
  </Grid>
  );
};
