import { useRef, useState, useEffect, ChangeEvent } from "react";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useMerchantConfig } from "@src/services/register/merchant/merchant/merchantConfig.tsx/getMerchantConfig";
import { useUpdateMerchantConfig } from "@src/services/register/merchant/merchant/merchantConfig.tsx/updateMerchantConfig";
import { IMerchantConfig } from "@src/services/types/register/merchants/merchantConfig.interface";
import { CurrencyInput } from "@src/components/CurrencyInput";
import { Toast } from "@components/Toast";
import {
  Form,
  FormInstance,
  Select,
  Button,
  Popconfirm,
  Checkbox,
  Input,
} from "antd";

export const MerchantConfigTab = (props: { id?: string }) => {
  const formRef = useRef<FormInstance>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation();
  const {
    merchantConfigData,
    refetchMerchantConfigData,
    isMerchantConfigFetching,
  } = useMerchantConfig(props?.id);
  const [body, setBody] = useState<IMerchantConfig | null | undefined>(
    merchantConfigData?.merchantConfig
  );
  const [bodyUpdate, setBodyUpdate] = useState<
    Partial<IMerchantConfig> | null | undefined
  >(null);
  const [withdrawUnlimited, setWithdrawUnlimited] = useState(false);
  const [payerPjUnlimited, setPayerPjUnlimited] = useState(false);
  const [differentPayerUnlimited, setDifferentPayerUnlimited] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const cashoutLimits = [null, 1, 2, 3, 4, 5];

  const { UpdateIsSuccess, UpdateMutate, UpdateIsLoading, UpdateError } =
    useUpdateMerchantConfig({ merchant_id: Number(props?.id), ...bodyUpdate });

  const handleWithdrawUnlimitedChange = (event: CheckboxChangeEvent) => {
    setWithdrawUnlimited(event.target.checked);
    formRef.current?.setFieldsValue({ cash_out_max_value: null });
    setBody((state: any) => ({
      ...state,
      cash_out_max_value: null,
    }));
    setBodyUpdate((state: any) => ({
      ...state,
      cash_out_max_value: null,
    }));
  };

  const handlPayerPjUnlimitedChange = (event: CheckboxChangeEvent) => {
    setPayerPjUnlimited(event.target.checked);
    formRef.current?.setFieldsValue({ cash_in_max_value_receive_by_pj: null });
    setBody((state: any) => ({
      ...state,
      cash_in_max_value_receive_by_pj: null,
    }));
    setBodyUpdate((state: any) => ({
      ...state,
      cash_in_max_value_receive_by_pj: null,
    }));
  };

  const handleDifferentPayerUnlimitedChange = (event: CheckboxChangeEvent) => {
    setDifferentPayerUnlimited(event.target.checked);
    formRef.current?.setFieldsValue({ cash_in_max_value_receive_by_different_payer: null });
    setBody((state: any) => ({
      ...state,
      cash_in_max_value_receive_by_different_payer: null,
    }));
    setBodyUpdate((state: any) => ({
      ...state,
      cash_in_max_value_receive_by_different_payer: null,
    }));
  };

  const handleSubmit = () => {
    const array = [
      { props: "cash_out_max_value", isUnlimited: withdrawUnlimited },
      { props: "cash_in_max_value_receive_by_pj",  isUnlimited: payerPjUnlimited },
      { props: "cash_in_max_value_receive_by_different_payer", isUnlimited: differentPayerUnlimited },
    ];
    const stopRequest = array.some((item) => {
      if(item.isUnlimited === false && body && body[item.props as keyof typeof body] === null ) {
        setIsConfirmOpen(false);
          return true
        } else return false
    })
  
    if(stopRequest) return;

    UpdateMutate();
    setIsConfirmOpen(false);
  }

  useEffect(() => {
    refetchMerchantConfigData();
  }, [UpdateIsSuccess]);

  useEffect(() => {
    formRef.current?.setFieldsValue(merchantConfigData?.merchantConfig);

    merchantConfigData?.merchantConfig?.cash_out_max_value === null &&
      setWithdrawUnlimited(true);
    merchantConfigData?.merchantConfig?.cash_in_max_value_receive_by_pj ===
      null && setPayerPjUnlimited(true);
    merchantConfigData?.merchantConfig
      ?.cash_in_max_value_receive_by_different_payer === null &&
      setDifferentPayerUnlimited(true);
  }, [merchantConfigData]);

  return (
    <Form
      ref={formRef}
      layout="vertical"
      onSubmitCapture={() => handleSubmit()}
      initialValues={
        merchantConfigData ? merchantConfigData?.merchantConfig : {}
      }
    >
      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          <Form.Item
            label={t("input.general_deposit_permission")}
            name="cash_in_permission"
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
              value={body?.cash_in_permission}
              onChange={(value) => {
                setBody((state) => ({
                  ...state,
                  cash_in_permission: value,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  cash_in_permission: value,
                }));
              }}
            />
          </Form.Item>
        </Grid>
        <Grid item xs={12} md={6}>
          <Form.Item
            label={t("input.general_withdraw_permission")}
            name="cash_out_permission"
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
              value={body?.cash_out_permission}
              onChange={(value) => {
                setBody((state) => ({
                  ...state,
                  cash_out_permission: value,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  cash_out_permission: value,
                }));
              }}
            />
          </Form.Item>
        </Grid>
        <Grid item xs={12} md={6}>
          <Form.Item
            label={t("input.withdraw_limit_document_by_day")}
            name="cash_out_transaction_limit"
          >
            <Select
              size="large"
              options={
                cashoutLimits?.map((item, index) => ({
                  key: index,
                  value: item,
                  label: item === null ? t(`input.unlimited`) : item,
                })) ?? []
              }
              value={body?.cash_out_transaction_limit}
              onChange={(value) => {
                setBody((state) => ({
                  ...state,
                  cash_out_transaction_limit: value,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  cash_out_transaction_limit: value,
                }));
              }}
            />
          </Form.Item>
        </Grid>
        <Grid item xs={8} sm={6} md={3}>
          <Form.Item
            label={t("input.cash_out_max_value")}
            name="cash_out_max_value"
            rules={[
              {
                required: !withdrawUnlimited,
                message:
                  t("input.required", {
                    field: t("input.cash_out_max_value"),
                  }) || "",
              },
            ]}
          >
            <CurrencyInput
              disabled={withdrawUnlimited}
              value={body?.cash_out_max_value || 0}
              onChange={(value) => {
                setBody((state) => ({
                  ...state,
                  cash_out_max_value: value,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  cash_out_max_value: value,
                }));
              }}
            />
          </Form.Item>
        </Grid>
        <Grid
          item
          container
          alignItems={"center"}
          style={{ marginTop: "28px" }}
          xs={4}
          sm={6}
          md={2}
        >
          <Form.Item label={""} name="pix_refund_fee_min">
            <Checkbox
              checked={withdrawUnlimited}
              onChange={handleWithdrawUnlimitedChange}
            >
              {t("input.unlimited")}
            </Checkbox>
          </Form.Item>
        </Grid>
        <Grid item xs={12} md={6}>
          <Form.Item
            label={t("input.account_PJ_payment_permission")}
            name="cash_in_receive_by_pj"
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
              value={body?.cash_in_receive_by_pj}
              onChange={(value) => {
                setBody((state) => ({
                  ...state,
                  cash_in_receive_by_pj: value,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  cash_in_receive_by_pj: value,
                }));
              }}
            />
          </Form.Item>
        </Grid>
        <Grid item xs={8} sm={6} md={3}>
          <Form.Item
            label={t("input.max_value_payer_pj_by_day")}
            name="cash_in_max_value_receive_by_pj"
            rules={[
              {
                required: !payerPjUnlimited,
                message:
                  t("input.required", {
                    field: t("input.max_value_payer_pj_by_day"),
                  }) || "",
              },
            ]}
          >
            <CurrencyInput
             disabled={payerPjUnlimited}
              value={body?.cash_in_max_value_receive_by_pj}
              onChange={(value) => {
                setBody((state) => ({
                  ...state,
                  cash_in_max_value_receive_by_pj: value,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  cash_in_max_value_receive_by_pj: value,
                }));
              }}
            />
          </Form.Item>
        </Grid>
        <Grid
          item
          container
          alignItems={"center"}
          style={{ marginTop: "28px" }}
          xs={12}
          sm={6}
          md={2}
        >
          <Form.Item label={""} name="pix_refund_fee_min">
            <Checkbox
              checked={payerPjUnlimited}
              onChange={handlPayerPjUnlimitedChange}
            >
              {t("input.unlimited")}
            </Checkbox>
          </Form.Item>
        </Grid>

        <Grid item xs={12} md={6}>
          <Form.Item
            label={t("input.permission_different_payer_pf")}
            name="cash_in_receive_by_different_payer"
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
              value={body?.cash_in_receive_by_different_payer}
              onChange={(value) => {
                setBody((state) => ({
                  ...state,
                  cash_in_receive_by_different_payer: value,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  cash_in_receive_by_different_payer: value,
                }));
              }}
            />
          </Form.Item>
        </Grid>
        <Grid item xs={8} sm={6} md={3}>
          <Form.Item
            label={t("input.max_value_different_payer_pf_by_day")}
            name="cash_in_max_value_receive_by_different_payer"
            rules={[
              {
                required: !differentPayerUnlimited,
                message:
                  t("input.required", {
                    field: t("input.max_value_different_payer_pf_by_day"),
                  }) || "",
              },
            ]}
          >
            <CurrencyInput
              disabled={differentPayerUnlimited}
              value={body?.cash_in_max_value_receive_by_different_payer || 0}
              onChange={(value) => {
                setBody((state) => ({
                  ...state,
                  cash_in_max_value_receive_by_different_payer: value,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  cash_in_max_value_receive_by_different_payer: value,
                }));
              }}
            />
          </Form.Item>
        </Grid>
        <Grid
          item
          container
          alignItems={"center"}
          style={{ marginTop: "30px" }}
          xs={12}
          sm={6}
          md={3}
        >
          <Form.Item label={""} name="pix_refund_fee_min">
            <Checkbox
              checked={differentPayerUnlimited}
              onChange={handleDifferentPayerUnlimitedChange}
            >
              {t("input.unlimited")}
            </Checkbox>
          </Form.Item>
        </Grid>

        <Grid item xs={12} md={6}>
          <Form.Item
            label={t("table.webhook_url_optional")}
            name="webhook_url_optional"
          >
            <Input
              size="large"
              name="webhook_url_optional"
              value={body?.webhook_url_optional}
              onChange={(e) => {
                setBody((state) => ({
                  ...state,
                  webhook_url_optional: e.target.value,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  webhook_url_optional: e.target.value,
                }));
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
        <button type="submit" ref={submitRef} style={{ display: "none" }}>
              Submit
            </button>
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
            onConfirm={() => submitRef.current?.click()}
            okButtonProps={{ loading: isMerchantConfigFetching }}
            okText={t("messages.yes_update")}
            cancelText={t("messages.no_cancel")}
            onCancel={() => setIsConfirmOpen(false)}
          >
            <Button
              size="large"
              type="primary"
              style={{ width: "100%" }}
              loading={isMerchantConfigFetching}
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
