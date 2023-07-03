/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState, useEffect, useCallback } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useUpdateFeesConfig } from "@src/services/register/merchant/merchant/feesConfig/updateFeesConfig";
import { useMerchantFeesConfig } from "@src/services/register/merchant/merchant/feesConfig/getFeesConfig";
import { Toast } from "@components/Toast";
import { IMerchantFeesProps } from "@src/services/types/register/merchants/merchantFeesConfig";
import { CurrencyInput } from "@src/components/CurrencyInput";
import {
  Form,
  FormInstance,
  Divider,
  Button,
  Input,
  Popconfirm,
  AutoComplete,
  Empty,
} from "antd";

export const FeesTab = (props: { id?: string }) => {
  const formRef = useRef<FormInstance>(null);
  const { t } = useTranslation();
  const [body, setBody] = useState<IMerchantFeesProps | null | undefined>(null);
  const [despositBank, setDepositBank] = useState<
    { bank?: string } | undefined
  >();
  const [withdrawBank, setWithdrawBank] = useState<
    { bank?: string } | undefined
  >();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const arrayPercentValue = ["PERCENT", "VALUE"];
  const {
    isMerchantFeesFetching,
    merchantFeesData,
    merchantFeesError,
    refetchMerchantFeesData,
  } = useMerchantFeesConfig(props.id);
  const { UpdateError, UpdateIsLoading, UpdateIsSuccess, UpdateMutate } =
    useUpdateFeesConfig(body as any);

  const initialPercentValue = useCallback(
    (feeProp: string): any => {
      const value =
        body && (feeProp !== null ? body[feeProp as keyof typeof body] : null);
      return arrayPercentValue.find((item: any) => item === value) || null;
    },
    [body]
  );

  useEffect(() => {
    setBody((state: any) => ({
      ...state,
      cash_in_bank: despositBank?.bank,
      cash_out_bank: withdrawBank?.bank,
    }));
    console.log({ despositBank });
  }, [despositBank, withdrawBank]);

  useEffect(() => {
    setBody(merchantFeesData?.fees);
  }, [merchantFeesData]);

  useEffect(() => {
    refetchMerchantFeesData();
  }, [UpdateIsSuccess]);

  console.log({ withdrawBank });
  return (
    <Form
      ref={formRef}
      layout="vertical"
      initialValues={merchantFeesData ? merchantFeesData : {}}
    >
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <p>Banco Deposito: </p>
          <p>Banco Saque:</p>
        </Grid>

        <Divider orientation="left">Depositos</Divider>

        <Grid item xs={12} md={6}>
          <Form.Item label={t("input.deposit_fee_type")} name="cash_in_bank">
            <AutoComplete
              size="large"
              options={
                arrayPercentValue?.map((item, index) => ({
                  key: index,
                  value: item,
                  label: item,
                })) ?? []
              }
              notFoundContent={<Empty />}
              value={initialPercentValue("cashin_pix_fee_type") || null}
              style={{ width: "100%", height: 40 }}
              onChange={(value) =>
                setBody((state) => ({
                  ...state,
                  cashin_pix_fee_type: value,
                }))
              }
              placeholder={t("table.payer_bank")}
            />
          </Form.Item>
        </Grid>
        <Grid item xs={12} md={6}>
          <Form.Item label={t("input.deposit_fee_plans")} name="cash_in_bank">
            <AutoComplete
              size="large"
              options={
                arrayPercentValue?.map((item, index) => ({
                  key: index,
                  value: item,
                  label: item,
                })) ?? []
              }
              notFoundContent={<Empty />}
              value={initialPercentValue("cashin_pix_fee_type") || null}
              style={{ width: "100%", height: 40 }}
              onChange={(value) =>
                setBody((state) => ({
                  ...state,
                  cashin_pix_fee_type: value,
                }))
              }
              placeholder={t("table.payer_bank")}
            />
          </Form.Item>
        </Grid>

        <Grid item xs={12} md={4}>
          <Form.Item label={t("input.deposit_fee_type")} name="cash_in_bank">
            <CurrencyInput
              value={body?.cashin_pix_fee_value}
              onChange={(value) =>
                setBody((state) => ({
                  ...state,
                  cashin_pix_fee_value: value,
                }))
              }
            />
          </Form.Item>
        </Grid>
        <Grid item xs={12} md={4}>
          <Form.Item label={t("input.deposit_fee_plans")} name="cash_in_bank">
            <AutoComplete
              size="large"
              options={
                arrayPercentValue?.map((item, index) => ({
                  key: index,
                  value: item,
                  label: item,
                })) ?? []
              }
              notFoundContent={<Empty />}
              value={initialPercentValue("cashin_pix_fee_type") || null}
              style={{ width: "100%", height: 40 }}
              onChange={(value) =>
                setBody((state) => ({
                  ...state,
                  cashin_pix_fee_type: value,
                }))
              }
              placeholder={t("table.payer_bank")}
            />
          </Form.Item>
        </Grid>

        <Grid item xs={12} md={4}>
          <Form.Item label={t("input.deposit_fee_plans")} name="cash_in_bank">
            <AutoComplete
              size="large"
              options={
                arrayPercentValue?.map((item, index) => ({
                  key: index,
                  value: item,
                  label: item,
                })) ?? []
              }
              notFoundContent={<Empty />}
              value={initialPercentValue("cashin_pix_fee_type") || null}
              style={{ width: "100%", height: 40 }}
              onChange={(value) =>
                setBody((state) => ({
                  ...state,
                  cashin_pix_fee_type: value,
                }))
              }
              placeholder={t("table.payer_bank")}
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
              UpdateMutate();
              setIsConfirmOpen(false);
            }}
            okButtonProps={{ loading: isMerchantFeesFetching }}
            okText={t("messages.yes_update")}
            cancelText={t("messages.no_cancel")}
            onCancel={() => setIsConfirmOpen(false)}
          >
            <Button
              size="large"
              type="primary"
              style={{ width: "100%" }}
              loading={isMerchantFeesFetching}
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
