/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Toast } from "@components/Toast";
import { Grid } from "@mui/material";
import CurrentAccountsSelect from "@src/components/Selects/currentAccountsSelect";
import { useUpdateAccountConfig } from "@src/services/register/merchant/merchant/accountConfig/updateAccountConfig";
import { useShowMerchantAccount } from "@src/services/register/merchant/merchant/showMerchantAccount";
import { Button, Form, FormInstance, Popconfirm, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export const AccountTab = (props: { id?: string }) => {
  const formRef = useRef<FormInstance>(null);
  const { t } = useTranslation();
  const [body, setBody] = useState<{
    merchant_id: number;
    account_id?: number;
  }>({ merchant_id: props.id ? Number(props.id) : 0, account_id: undefined });
  const [query, setQuery] = useState<any>({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const { MerchantData, isMerchantDataFetching } = useShowMerchantAccount(
    Number(props?.id),
    query
  );

  const { UpdateMutate, UpdateError, UpdateIsSuccess } = useUpdateAccountConfig(
    {
      merchant_id: body.merchant_id,
      account_id: body.account_id || 0,
    }
  );

  useEffect(() => {
    setBody({
      merchant_id: Number(props.id!),
      account_id: MerchantData?.account?.id,
    });
  }, [MerchantData]);

  return (
    <Form
      ref={formRef}
      layout="vertical"
      initialValues={MerchantData ? MerchantData : {}}
    >
      <Typography style={{ marginTop: 10, marginBottom: 20 }}>
        {t("table.bank_acc_number")}:{" "}
        {MerchantData?.account?.name ? (
          <Typography.Text strong>
            {MerchantData?.account?.name}
          </Typography.Text>
        ) : (
          <Typography.Text strong>{t("table.unassigned")}</Typography.Text>
        )}
      </Typography>

      <Grid container spacing={1}>
        <Grid item xs={12} md={4}>
          <Form.Item label={t("table.bank_acc_number")}>
            <CurrentAccountsSelect
              setBody={setBody}
              body={body}
              query={query}
              setQuery={setQuery}
              filterIdProp={""}
              filterIdValue={undefined}
            />
          </Form.Item>
        </Grid>
      </Grid>

      <Grid
        item
        container
        xs={12}
        style={{ display: "flex", flexDirection: "row-reverse" }}
      >
        <Grid item xs={12} md={4} lg={4}>
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
              UpdateMutate();
              setIsConfirmOpen(false);
            }}
            okButtonProps={{ loading: isMerchantDataFetching }}
            okText={t("messages.yes_update")}
            cancelText={t("messages.no_cancel")}
            onCancel={() => setIsConfirmOpen(false)}
          >
            <Button
              data-test-id="update-general-configs"
              size="large"
              type="primary"
              style={{ width: "100%" }}
              loading={isMerchantDataFetching}
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
        error={UpdateError}
        success={UpdateIsSuccess}
      />
    </Form>
  );
};
