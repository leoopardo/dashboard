import { useRef, useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useMerchantBankConfig } from "@services/register/merchant/merchant/bankConfig/getBankConfig";
import { useUpdateBankConfig } from "@src/services/register/merchant/merchant/bankConfig/updateBankConfig";
import { IMerchantBankUpdate } from "@services/types/register/merchants/merchantBankConfig";
import { CurrencyInput } from "@src/components/CurrencyInput";
import { Toast } from "@components/Toast";
import { Form, FormInstance, Select, Button, Popconfirm, Checkbox, Input } from "antd";

export const MerchantConfigTab = (props: { id?: string }) => {
  const formRef = useRef<FormInstance>(null);
  const { t } = useTranslation();
  const [body, setBody] = useState<IMerchantBankUpdate | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const {
    isMerchantBankFetching,
    merchantBankData,
    merchantBankError,
    refetchMerchantBankData,
  } = useMerchantBankConfig(props.id);
  const { UpdateError, UpdateIsLoading, UpdateIsSuccess, UpdateMutate } =
    useUpdateBankConfig(body);

  useEffect(() => {
    setBody((state: any) => ({
      ...state,
      merchants_ids: [Number(props?.id)],
      cash_in_bank: merchantBankData?.merchantConfig?.cash_in_bank,
      cash_out_bank: merchantBankData?.merchantConfig?.cash_out_bank,
    }));
  }, [merchantBankData]);

  useEffect(() => {
    refetchMerchantBankData();
  }, [UpdateIsSuccess]);

  return (
    <Form
      ref={formRef}
      layout="vertical"
      initialValues={merchantBankData ? merchantBankData : {}}
    >
      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          <Form.Item
            label={t("input.withdraw_fee_type")}
            name="customer_withdraw_fee_type"
          >
            <Select
              size="large"
              options={
                [true, false]?.map((item, index) => ({
                  key: index,
                  value: item,
                  label: `${t(`table.${item}`)}`,
                })) ?? []
              }
              value={null}
              onChange={(value) => {
                /*     setBody((state) => ({
                  ...state,
                  customer_withdraw_fee_type: value,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  customer_withdraw_fee_type: value,
                })); */
              }}
            />
          </Form.Item>
        </Grid>
        <Grid item xs={12} md={6}>
          <Form.Item
            label={t("input.withdraw_fee_type")}
            name="customer_withdraw_fee_type"
          >
            <Select
              size="large"
              options={
                [true, false]?.map((item, index) => ({
                  key: index,
                  value: item,
                  label: `${t(`table.${item}`)}`,
                })) ?? []
              }
              value={null}
              onChange={(value) => {
                /*     setBody((state) => ({
                  ...state,
                  customer_withdraw_fee_type: value,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  customer_withdraw_fee_type: value,
                })); */
              }}
            />
          </Form.Item>
        </Grid>
        <Grid item xs={8} sm={6} md={2}>
          <Form.Item
            label={t("input.deposit_refund_fee_minimum_value")}
            name="pix_refund_fee_min"
          >
            <CurrencyInput
              value={""}
              onChange={(value) => {
                /*   setBody((state) => ({
                  ...state,
                  pix_refund_fee_value: value,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  pix_refund_fee_value: value,
                })); */
              }}
            />
          </Form.Item>
        </Grid>
        <Grid item container alignItems={'center'} style={{marginTop: '28px'}} xs={4} sm={6} md={2}>
          <Form.Item
            label={''}
            name="pix_refund_fee_min"
          >
            <Checkbox
              checked={true}
              onChange={(event: any) => {
              /*   isAgeAbled(event.target.checked);
                setIsAgeRangeAbled(event.target.checked); */
              }}
            >
              {t("table.unlimited")}
            </Checkbox>
          </Form.Item>
        </Grid>
        <Grid item xs={8} sm={6} md={2}>
          <Form.Item
            label={t("input.deposit_refund_fee_minimum_value")}
            name="pix_refund_fee_min"
          >
            <CurrencyInput
              value={""}
              onChange={(value) => {
                /*   setBody((state) => ({
                  ...state,
                  pix_refund_fee_value: value,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  pix_refund_fee_value: value,
                })); */
              }}
            />
          </Form.Item>
        </Grid>
        <Grid item container alignItems={'center'} style={{marginTop: '28px'}} xs={12} sm={6} md={2}>
          <Form.Item
            label={''}
            name="pix_refund_fee_min"
          >
            <Checkbox
              checked={true}
              onChange={(event: any) => {
              /*   isAgeAbled(event.target.checked);
                setIsAgeRangeAbled(event.target.checked); */
              }}
            >
              {t("table.unlimited")}
            </Checkbox>
          </Form.Item>
        </Grid>
        <Grid item xs={8} sm={6} md={2}>
          <Form.Item
            label={t("input.deposit_refund_fee_minimum_value")}
            name="pix_refund_fee_min"
          >
            <CurrencyInput
              value={""}
              onChange={(value) => {
                /*   setBody((state) => ({
                  ...state,
                  pix_refund_fee_value: value,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  pix_refund_fee_value: value,
                })); */
              }}
            />
          </Form.Item>
        </Grid>
        <Grid item container alignItems={'center'} style={{marginTop: '50px'}} xs={12} sm={6} md={2}>
          <Form.Item
            label={''}
            name="pix_refund_fee_min"
          >
            <Checkbox
              checked={true}
              onChange={(event: any) => {
              /*   isAgeAbled(event.target.checked);
                setIsAgeRangeAbled(event.target.checked); */
              }}
            >
              {t("table.unlimited1")}
            </Checkbox>
          </Form.Item>
        </Grid>

        <Grid item xs={12} md={6}>
          <Form.Item
            label={t("input.withdraw_fee_type")}
            name="customer_withdraw_fee_type"
          >
            <Select
              size="large"
              options={
                [true, false]?.map((item, index) => ({
                  key: index,
                  value: item,
                  label: `${t(`table.${item}`)}`,
                })) ?? []
              }
              value={null}
              onChange={(value) => {
                /*     setBody((state) => ({
                  ...state,
                  customer_withdraw_fee_type: value,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  customer_withdraw_fee_type: value,
                })); */
              }}
            />
          </Form.Item>
        </Grid>

        <Grid item xs={12} md={6}>
          <Form.Item
            label={t("input.withdraw_fee_percent")}
            name="customer_withdraw_fee_percent"
          >
            <Input
              size="large"
              name="customer_withdraw_fee_percent"
              value={''}
              onChange={(e) => {
             /*    setBody((state) => ({
                  ...state,
                  customer_withdraw_fee_percent: Number(e.target.value),
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  customer_withdraw_fee_percent: Number(e.target.value),
                })); */
              }}
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
              {t("buttons.update", { menu: "configs" })}
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
