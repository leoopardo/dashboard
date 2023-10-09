/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BanksSelect } from "@components/Selects/bankSelect";
import { Toast } from "@components/Toast";
import { Grid } from "@mui/material";
import { useMerchantBankConfig } from "@services/register/merchant/merchant/bankConfig/getBankConfig";
import { useUpdateBankConfig } from "@src/services/register/merchant/merchant/bankConfig/updateBankConfig";
import { IMerchantBankUpdate } from "@src/services/types/register/merchants/merchantBankConfig.interface";
import { Button, Form, FormInstance, Popconfirm, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export const BanksTab = (props: { id?: string }) => {
  const formRef = useRef<FormInstance>(null);
  const { t } = useTranslation();
  const [body, setBody] = useState<IMerchantBankUpdate | null>(null);
  const [despositBank, setDepositBank] = useState<
    { bank?: string } | undefined
  >();
  const [withdrawBank, setWithdrawBank] = useState<
    { bank?: string } | undefined
  >();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { isMerchantBankFetching, merchantBankData, refetchMerchantBankData } =
    useMerchantBankConfig(props.id);
  const { UpdateBankError, UpdateBankIsSuccess, UpdateMutate } =
    useUpdateBankConfig(body);

  useEffect(() => {
    setBody((state: any) => ({
      ...state,
      cash_in_bank: despositBank?.bank,
      cash_out_bank: withdrawBank?.bank,
    }));
  }, [despositBank, withdrawBank]);

  useEffect(() => {
    setBody((state: any) => ({
      ...state,
      merchants_ids: [Number(props?.id)],
      cash_in_bank: merchantBankData?.merchantConfig?.cash_in_bank,
      cash_out_bank: merchantBankData?.merchantConfig?.cash_out_bank,
    }));

    setDepositBank({ bank: merchantBankData?.merchantConfig?.cash_in_bank });
    setWithdrawBank({ bank: merchantBankData?.merchantConfig?.cash_out_bank });
  }, [merchantBankData]);

  useEffect(() => {
    refetchMerchantBankData();
  }, [UpdateBankIsSuccess]);

  return (
    <Form
      ref={formRef}
      layout="vertical"
      initialValues={merchantBankData ? merchantBankData : {}}
    >
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography>{t("input.deposit_bank")}: {merchantBankData?.merchantConfig?.cash_in_bank}</Typography>
          <Typography>{t("input.withdraw_bank")}: {merchantBankData?.merchantConfig?.cash_out_bank}</Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Form.Item label={t("input.deposit_bank")} name="cash_in_bank">
            <BanksSelect
              queryOptions={despositBank?.bank}
              currentValue={despositBank?.bank}
              setCurrentValue={setDepositBank}
              setQueryFunction={setDepositBank}
            />
          </Form.Item>
        </Grid>
        <Grid item xs={12} md={4}>
          <Form.Item label={t("input.withdraw_bank")} name="cash_out_bank">
            <BanksSelect
              currentValue={withdrawBank?.bank}
              queryOptions={withdrawBank?.bank}
              setCurrentValue={setWithdrawBank}
              setQueryFunction={setWithdrawBank}
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
            okButtonProps={{ loading: isMerchantBankFetching }}
            okText={t("messages.yes_update")}
            cancelText={t("messages.no_cancel")}
            onCancel={() => setIsConfirmOpen(false)}
          >
            <Button
              size="large"
              type="primary"
              style={{ width: "100%" }}
              loading={isMerchantBankFetching}
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
        error={UpdateBankError}
        success={UpdateBankIsSuccess}
      />
    </Form>
  );
};
