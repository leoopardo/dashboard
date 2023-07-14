/* eslint-disable react-hooks/exhaustive-deps */
import { Toast } from "@components/Toast";
import { Grid } from "@mui/material";
import { CurrencyInput } from "@src/components/CurrencyInput";
import { useGetDepositFeePlansRegister } from "@src/services/register/merchant/feePlans/getDepositFeePlans";
import { useGetWithdrawFeePlansRegister } from "@src/services/register/merchant/feePlans/getWithdrawFeePlans";
import { useMerchantFeesConfig } from "@src/services/register/merchant/merchant/feesConfig/getFeesConfig";
import { useUpdateFeesConfig } from "@src/services/register/merchant/merchant/feesConfig/updateFeesConfig";
import {
  IMerchantFeesProps,
  IMerchantFeesUpdate,
} from "@src/services/types/register/merchants/merchantFeesConfig.interface";
import {
  Button,
  Divider,
  Form,
  FormInstance,
  Input,
  Popconfirm,
  Select,
} from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export const FeesTab = (props: { id?: string }) => {
  const formRef = useRef<FormInstance>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation();
  const { isMerchantFeesFetching, merchantFeesData, refetchMerchantFeesData } =
    useMerchantFeesConfig(props.id);
  const [body, setBody] = useState<IMerchantFeesProps | null | undefined>({
    ...merchantFeesData?.fees,
  });

  const [bodyUpdate, setBodyUpdate] = useState<
    IMerchantFeesUpdate | null | undefined
  >();
  const { depositFeePlansData } = useGetDepositFeePlansRegister();

  const { withdrawFeePlansData } = useGetWithdrawFeePlansRegister();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const arrayPercentValue = ["PERCENT", "VALUE"];

  const { UpdateError, UpdateIsSuccess, UpdateMutate } = useUpdateFeesConfig({
    merchant_id: Number(props?.id),
    ...bodyUpdate,
  });

  const handleDepositFeeTypeChange = (value: string) => {
    if (value === "PERCENT") {
      setBody((state) => ({
        ...state,
        cashin_pix_fee_value: 0,
        cashin_pix_fee_type: value,
      }));
      setBodyUpdate((state) => ({
        ...state,
        cashin_pix_fee_value: 0,
        cashin_pix_fee_type: value,
      }));
      formRef.current?.setFieldsValue({ cashin_pix_fee_value: 0 });
    } else {
      setBody((state) => ({
        ...state,
        cashin_pix_fee_percent: 0,
        cashin_pix_fee_type: value,
      }));
      setBodyUpdate((state) => ({
        ...state,
        cashin_pix_fee_percent: 0,
        cashin_pix_fee_type: value,
      }));
      formRef.current?.setFieldsValue({ cashin_pix_fee_percent: 0 });
    }
  };

  const handleSubmit = useCallback(() => {
    const array = [
      {
        proptype: "cashin_pix_fee_type",
        type: "PERCENT",
        value: "cashin_pix_fee_percent",
      },
      {
        proptype: "cashin_pix_fee_type",
        type: "VALUE",
        value: "cashin_pix_fee_value",
      },
      {
        proptype: "customer_withdraw_fee_type",
        type: "PERCENT",
        value: "customer_withdraw_fee_percent",
      },
      {
        proptype: "customer_withdraw_fee_type",
        type: "VALUE",
        value: "customer_withdraw_fee_value",
      },
      {
        proptype: "pix_refund_fee_type",
        type: "PERCENT",
        value: "pix_refund_fee_percent",
      },
      {
        proptype: "pix_refund_fee_type",
        type: "VALUE",
        value: "pix_refund_fee_value",
      },
    ];
    const stopRequest = array.some((item) => {
      if (
        body &&
        body[item.proptype as keyof typeof body] === item.type &&
        ((bodyUpdate &&
          bodyUpdate?.[item.value as keyof typeof bodyUpdate] === undefined) ||
          Number(bodyUpdate?.[item.value as keyof typeof bodyUpdate]) <= 0)
      ) {
        return true;
      } else return false;
    });

    if (stopRequest) return;

    UpdateMutate();
    setIsConfirmOpen(false);
  }, [body, bodyUpdate]);

  useEffect(() => {
    refetchMerchantFeesData();
  }, [UpdateIsSuccess]);

  useEffect(() => {
    formRef.current?.setFieldsValue(merchantFeesData?.fees);
  }, [merchantFeesData, depositFeePlansData, withdrawFeePlansData]);

  return (
    <Form
      ref={formRef}
      layout="vertical"
      onSubmitCapture={() => handleSubmit()}
      initialValues={merchantFeesData ? merchantFeesData?.fees : {}}
    >
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <p>
            {t("titles.current_deposit_fee")}:{" "}
            {merchantFeesData?.fees?.cashin_pix_fee_percent}%{" "}
          </p>
          <p>
            {t("titles.current_withdraw_fee")}:{" "}
            {merchantFeesData?.fees?.customer_withdraw_fee_percent}%{" "}
          </p>
          <p>
            {t("titles.current_deposit_refund_fee")}:{" "}
            {merchantFeesData?.fees?.pix_refund_fee_percent}%{" "}
          </p>
        </Grid>

        <Divider orientation="left">{t("menus.deposit")}</Divider>

        <Grid item xs={12} md={6}>
          <Form.Item
            label={t("input.deposit_fee_type")}
            name="cashin_pix_fee_type"
          >
            <Select
              size="large"
              options={
                arrayPercentValue?.map((item, index) => ({
                  key: index,
                  value: item,
                  label: `${t(`table.${item.toLocaleLowerCase()}`)}`,
                })) ?? []
              }
              value={body?.cashin_pix_fee_type || null}
              onChange={handleDepositFeeTypeChange}
            />
          </Form.Item>
        </Grid>
        <Grid item xs={12} md={6}>
          <Form.Item
            label={t("input.deposit_fee_plan")}
            name="cashin_pix_fee_plan_id"
          >
            <Select
              size="large"
              options={
                depositFeePlansData?.merchant_fee_plans?.map((item, index) => ({
                  key: index,
                  value: item.id,
                  label: item.name,
                })) ?? []
              }
              value={body?.cashin_pix_fee_plan_id || null}
              onChange={(value) => {
                setBody((state) => ({
                  ...state,
                  cashin_pix_fee_plan_id: Number(value),
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  cashin_pix_fee_plan_id: Number(value),
                }));
              }}
            />
          </Form.Item>
        </Grid>

        <Grid item xs={12} md={4}>
          <Form.Item
            label={t("input.deposit_fee_percent")}
            name="cashin_pix_fee_percent"
            rules={[
              {
                type: "number",
                min: body?.cashin_pix_fee_type === "PERCENT" ? 0.01 : 0,
                message: t("messages.min_value_higher_then_zero") || "",
              },
            ]}
          >
            <Input
              size="large"
              type="number"
              name="cashin_pix_fee_percent"
              disabled={body?.cashin_pix_fee_type === "VALUE"}
              value={body?.cashin_pix_fee_percent}
              onChange={(e) => {
                setBody((state) => ({
                  ...state,
                  cashin_pix_fee_percent: Number(e.target.value),
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  cashin_pix_fee_percent: Number(e.target.value),
                }));
              }}
            />
          </Form.Item>
        </Grid>
        <Grid item xs={12} md={4}>
          <Form.Item
            label={t("input.deposit_fee_value")}
            name="cashin_pix_fee_value"
            rules={[
              {
                type: "number",
                min: body?.cashin_pix_fee_type === "VALUE" ? 0.01 : 0,
                message: t("messages.min_value_higher_then_zero") || "",
              },
            ]}
          >
            <CurrencyInput
              disabled={body?.cashin_pix_fee_type === "PERCENT"}
              value={body?.cashin_pix_fee_value}
              onChange={(value) => {
                setBody((state) => ({
                  ...state,
                  cashin_pix_fee_value: Number(value),
                }));

                setBodyUpdate((state) => ({
                  ...state,
                  cashin_pix_fee_value: Number(value),
                }));
              }}
            />
          </Form.Item>
        </Grid>

        <Grid item xs={12} md={4}>
          <Form.Item
            label={t("input.deposit_fee_minimum_value")}
            name="cashin_pix_fee_min"
          >
            <CurrencyInput
              value={body?.cashin_pix_fee_min}
              onChange={(value) => {
                setBody((state) => ({
                  ...state,
                  cashin_pix_fee_min: value,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  cashin_pix_fee_min: value,
                }));
              }}
            />
          </Form.Item>
        </Grid>

        <Divider orientation="left">{t("menus.withdrawals")}</Divider>

        <Grid item xs={12} md={6}>
          <Form.Item
            label={t("input.withdraw_fee_type")}
            name="customer_withdraw_fee_type"
          >
            <Select
              size="large"
              options={
                arrayPercentValue?.map((item, index) => ({
                  key: index,
                  value: item,
                  label: `${t(`table.${item.toLocaleLowerCase()}`)}`,
                })) ?? []
              }
              value={body?.customer_withdraw_fee_type || null}
              onChange={(value) => {
                setBody((state) => ({
                  ...state,
                  customer_withdraw_fee_type: value,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  customer_withdraw_fee_type: value,
                }));
              }}
            />
          </Form.Item>
        </Grid>
        <Grid item xs={12} md={6}>
          <Form.Item
            label={t("input.withdraw_fee_plan")}
            name="customer_withdraw_fee_plan_id"
          >
            <Select
              size="large"
              options={
                withdrawFeePlansData?.merchant_fee_plans?.map(
                  (item, index) => ({
                    key: index,
                    value: item.id,
                    label: item.name,
                  })
                ) ?? []
              }
              value={body?.customer_withdraw_fee_plan_id || null}
              onChange={(value) => {
                setBody((state) => ({
                  ...state,
                  customer_withdraw_fee_plan_id: Number(value),
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  customer_withdraw_fee_plan_id: Number(value),
                }));
              }}
            />
          </Form.Item>
        </Grid>

        <Grid item xs={12} md={4}>
          <Form.Item
            label={t("input.withdraw_fee_percent")}
            name="customer_withdraw_fee_percent"
            rules={[
              {
                type: "number",
                min: body?.customer_withdraw_fee_type === "PERCENT" ? 0.01 : 0,
                message: t("messages.min_value_higher_then_zero") || "",
              },
            ]}
          >
            <Input
              size="large"
              type="number"
              name="customer_withdraw_fee_percent"
              disabled={body?.customer_withdraw_fee_type === "VALUE"}
              value={body?.customer_withdraw_fee_percent}
              onChange={(e) => {
                setBody((state) => ({
                  ...state,
                  customer_withdraw_fee_percent: Number(e.target.value),
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  customer_withdraw_fee_percent: Number(e.target.value),
                }));
              }}
            />
          </Form.Item>
        </Grid>
        <Grid item xs={12} md={4}>
          <Form.Item
            label={t("input.withdraw_fee_value")}
            name="customer_withdraw_fee_value"
            rules={[
              {
                type: "number",
                min: body?.customer_withdraw_fee_type === "VALUE" ? 0.01 : 0,
                message: t("messages.min_value_higher_then_zero") || "",
              },
            ]}
          >
            <CurrencyInput
              disabled={body?.customer_withdraw_fee_type === "PERCENT"}
              value={body?.customer_withdraw_fee_value}
              onChange={(value) => {
                setBody((state) => ({
                  ...state,
                  customer_withdraw_fee_value: Number(value),
                }));

                setBodyUpdate((state) => ({
                  ...state,
                  customer_withdraw_fee_value: Number(value),
                }));
              }}
            />
          </Form.Item>
        </Grid>

        <Grid item xs={12} md={4}>
          <Form.Item
            label={t("input.withdraw_fee_minimum_value")}
            name="customer_withdraw_fee_min"
          >
            <CurrencyInput
              value={body?.customer_withdraw_fee_min}
              onChange={(value) => {
                setBody((state) => ({
                  ...state,
                  customer_withdraw_fee_min: value,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  customer_withdraw_fee_min: value,
                }));
              }}
            />
          </Form.Item>
        </Grid>

        <Divider orientation="left">{t("menus.refunds")}</Divider>

        <Grid item xs={12} sm={6} md={3}>
          <Form.Item
            label={t("input.deposit_refund_fee_type")}
            name="pix_refund_fee_type"
          >
            <Select
              size="large"
              options={
                arrayPercentValue?.map((item, index) => ({
                  key: index,
                  value: item,
                  label: `${t(`table.${item.toLocaleLowerCase()}`)}`,
                })) ?? []
              }
              value={body?.pix_refund_fee_type || null}
              onChange={(value) => {
                setBody((state) => ({
                  ...state,
                  pix_refund_fee_type: value,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  pix_refund_fee_type: value,
                }));
              }}
            />
          </Form.Item>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Form.Item
            label={t("input.deposit_refund_fee_percent")}
            name="pix_refund_fee_percent"
            rules={[
              {
                type: "number",
                min: body?.pix_refund_fee_type === "PERCENT" ? 0.01 : 0,
                message: t("messages.min_value_higher_then_zero") || "",
              },
            ]}
          >
            <Input
              size="large"
              type="number"
              name="pix_refund_fee_percent"
              disabled={body?.pix_refund_fee_type === "VALUE"}
              value={body?.pix_refund_fee_percent}
              onChange={(e) => {
                setBody((state) => ({
                  ...state,
                  pix_refund_fee_percent: Number(e.target.value),
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  pix_refund_fee_percent: Number(e.target.value),
                }));
              }}
            />
          </Form.Item>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Form.Item
            label={t("input.deposit_refund_fee_value")}
            name="pix_refund_fee_value"
            rules={[
              {
                type: "number",
                min: body?.pix_refund_fee_type === "VALUE" ? 0.01 : 0,
                message: t("messages.min_value_higher_then_zero") || "",
              },
            ]}
          >
            <CurrencyInput
              disabled={body?.pix_refund_fee_type === "PERCENT"}
              value={body?.pix_refund_fee_value}
              onChange={(value) => {
                setBody((state) => ({
                  ...state,
                  pix_refund_fee_value: value,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  pix_refund_fee_value: value,
                }));
              }}
            />
          </Form.Item>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Form.Item
            label={t("input.deposit_refund_fee_minimum_value")}
            name="pix_refund_fee_min"
          >
            <CurrencyInput
              value={Number(body?.pix_refund_fee_min)}
              onChange={(value) => {
                setBody((state) => ({
                  ...state,
                  pix_refund_fee_value: value,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  pix_refund_fee_value: value,
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
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
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
                {t("buttons.update", { menu: `${t("table.fee")}s` })}
              </Button>
            </Popconfirm>
          </Form.Item>
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
