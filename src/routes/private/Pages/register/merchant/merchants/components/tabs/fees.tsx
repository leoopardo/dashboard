/* eslint-disable react-hooks/exhaustive-deps */
import { Toast } from "@components/Toast";
import { Grid } from "@mui/material";
import { useGetDepositFeePlansRegister } from "@src/services/register/merchant/feePlans/getDepositFeePlans";
import { useGetWithdrawFeePlansRegister } from "@src/services/register/merchant/feePlans/getWithdrawFeePlans";
import { useMerchantFeesConfig } from "@src/services/register/merchant/merchant/feesConfig/getFeesConfig";
import { useUpdateFeesConfig } from "@src/services/register/merchant/merchant/feesConfig/updateFeesConfig";
import {
  IMerchantFeesProps,
  IMerchantFeesUpdate,
} from "@src/services/types/register/merchants/merchantFeesConfig.interface";
import { moneyFormatter } from "@src/utils/moneyFormatter";
import {
  Button,
  Divider,
  Form,
  FormInstance,
  Input,
  Popconfirm,
  Select,
  Typography,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { CurrencyInput } from "react-currency-mask";
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

  useEffect(() => {
    const handleWheel = () => {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement?.tagName.toLowerCase() === "input") {
        activeElement?.blur();
      }
    };

    document.addEventListener("wheel", handleWheel);

    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, []);

  useEffect(() => {
    refetchMerchantFeesData();
  }, [UpdateIsSuccess]);

  useEffect(() => {
    formRef.current?.setFieldsValue(merchantFeesData?.fees);
    setBody(merchantFeesData?.fees);
  }, [merchantFeesData, depositFeePlansData, withdrawFeePlansData]);

  return (
    <Form
      ref={formRef}
      layout="vertical"
      onFinish={() => {
        UpdateMutate();
        setIsConfirmOpen(false);
      }}
      initialValues={merchantFeesData ? merchantFeesData?.fees : {}}
    >
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography.Title level={5} mark>
            {t("titles.current_deposit_fee")}:{" "}
            {merchantFeesData?.fees?.cashin_pix_fee_type === "PERCENT"
              ? `${merchantFeesData?.fees?.cashin_pix_fee_percent}%`
              : moneyFormatter(
                  merchantFeesData?.fees?.cashin_pix_fee_value || 0
                )}
          </Typography.Title>
          <Typography.Title level={5} mark>
            {t("titles.current_withdraw_fee")}:{" "}
            {merchantFeesData?.fees?.customer_withdraw_fee_type === "PERCENT"
              ? `${merchantFeesData?.fees?.customer_withdraw_fee_percent}%`
              : moneyFormatter(
                  merchantFeesData?.fees?.customer_withdraw_fee_value || 0
                )}
          </Typography.Title>
          <Typography.Title level={5} mark>
            {t("titles.current_deposit_refund_fee")}:{" "}
            {merchantFeesData?.fees?.pix_refund_fee_type === "PERCENT"
              ? `${merchantFeesData?.fees?.pix_refund_fee_percent}%`
              : moneyFormatter(
                  merchantFeesData?.fees?.pix_refund_fee_value || 0
                )}
          </Typography.Title>
        </Grid>

        <Divider orientation="left">
          <Typography.Title level={3}>{t("menus.deposit")}</Typography.Title>
        </Divider>

        <Grid item xs={12} md={6}>
          <Form.Item
            label={t("input.deposit_fee_type")}
            name="cashin_pix_fee_type"
          >
            <Select
              data-test-id="deposit_fee_type"
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
              data-test-id="deposit_fee_plan"
              size="large"
              options={
                depositFeePlansData?.items?.map((item, index) => ({
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
                validator: () => {
                  const numericValue = body?.cashin_pix_fee_percent || 0;
                  const minValue =
                    body?.cashin_pix_fee_type === "PERCENT" ? 0.01 : 0;

                  if (numericValue < minValue) {
                    return Promise.reject(
                      t("messages.min_value_higher_then_zero") || ""
                    );
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              data-test-id="deposit_fee_percent"
              size="large"
              type="number"
              step={0.01}
              // eslint-disable-next-line @typescript-eslint/no-empty-function
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
                validator: () => {
                  const numericValue = body?.cashin_pix_fee_value || 0;
                  const minValue =
                    body?.cashin_pix_fee_type === "VALUE" ? 0.01 : 0;

                  if (numericValue < minValue) {
                    return Promise.reject(
                      t("messages.min_value_higher_then_zero") || ""
                    );
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <CurrencyInput
              data-test-id="deposit_fee_value"
              onChangeValue={(_event, originalValue) => {
                setBody((state) => ({
                  ...state,
                  cashin_pix_fee_value: +originalValue,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  cashin_pix_fee_value: +originalValue,
                }));
              }}
              InputElement={
                <Input
                  size="large"
                  style={{ width: "100%" }}
                  disabled={body?.cashin_pix_fee_type === "PERCENT"}
                  value={body?.cashin_pix_fee_value}
                />
              }
            />
          </Form.Item>
        </Grid>

        <Grid item xs={12} md={4}>
          <Form.Item
            label={t("input.deposit_fee_minimum_value")}
            name="cashin_pix_fee_min"
          >
            <CurrencyInput
              data-test-id="deposit_fee_min"
              onChangeValue={(_event, originalValue) => {
                setBody((state) => ({
                  ...state,
                  cashin_pix_fee_min: +originalValue,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  cashin_pix_fee_min: +originalValue,
                }));
              }}
              InputElement={
                <Input
                  size="large"
                  style={{ width: "100%" }}
                  value={body?.cashin_pix_fee_min}
                />
              }
            />
          </Form.Item>
        </Grid>

        <Divider orientation="left">
          <Typography.Title level={3}>
            {t("menus.withdrawals")}
          </Typography.Title>
        </Divider>

        <Grid item xs={12} md={6}>
          <Form.Item
            label={t("input.withdraw_fee_type")}
            name="customer_withdraw_fee_type"
          >
            <Select
              data-test-id="withdraw_fee_type"
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
              data-test-id="withdraw_fee_plan"
              size="large"
              options={
                withdrawFeePlansData?.items?.map((item, index) => ({
                  key: index,
                  value: item.id,
                  label: item.name,
                })) ?? []
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
                validator: () => {
                  const numericValue = body?.customer_withdraw_fee_percent || 0;
                  const minValue =
                    body?.customer_withdraw_fee_type === "PERCENT" ? 0.01 : 0;

                  if (numericValue < minValue) {
                    return Promise.reject(
                      t("messages.min_value_higher_then_zero") || ""
                    );
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              data-test-id="withdraw_fee_percent"
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
                validator: () => {
                  const numericValue = body?.customer_withdraw_fee_value || 0;
                  const minValue =
                    body?.customer_withdraw_fee_type === "VALUE" ? 0.01 : 0;

                  if (numericValue < minValue) {
                    return Promise.reject(
                      t("messages.min_value_higher_then_zero") || ""
                    );
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <CurrencyInput
              data-test-id="withdraw_fee_value"
              onChangeValue={(_event, originalValue) => {
                setBody((state) => ({
                  ...state,
                  customer_withdraw_fee_value: +originalValue,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  customer_withdraw_fee_value: +originalValue,
                }));
              }}
              InputElement={
                <Input
                  disabled={body?.customer_withdraw_fee_type === "PERCENT"}
                  size="large"
                  style={{ width: "100%" }}
                  value={body?.customer_withdraw_fee_value}
                />
              }
            />
          </Form.Item>
        </Grid>

        <Grid item xs={12} md={4}>
          <Form.Item
            label={t("input.withdraw_fee_minimum_value")}
            name="customer_withdraw_fee_min"
          >
            <CurrencyInput
              onChangeValue={(_event, originalValue) => {
                setBody((state) => ({
                  ...state,
                  customer_withdraw_fee_min: +originalValue,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  customer_withdraw_fee_min: +originalValue,
                }));
              }}
              InputElement={
                <Input
                  data-test-id="withdraw_fee_min"
                  size="large"
                  style={{ width: "100%" }}
                  value={body?.customer_withdraw_fee_min}
                />
              }
            />
          </Form.Item>
        </Grid>

        <Divider orientation="left">
          <Typography.Title level={3}>{t("menus.refunds")}</Typography.Title>
        </Divider>

        <Grid item xs={12} sm={6} md={3}>
          <Form.Item
            label={t("input.deposit_refund_fee_type")}
            name="pix_refund_fee_type"
          >
            <Select
              data-test-id="deposit_refund_fee_type"
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
          >
            <Input
              data-test-id="deposit_refund_fee_percent"
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
          >
            <CurrencyInput
              data-test-id="deposit_refund_fee_value"
              onChangeValue={(_event, originalValue) => {
                setBody((state) => ({
                  ...state,
                  pix_refund_fee_value: +originalValue,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  pix_refund_fee_value: +originalValue,
                }));
              }}
              InputElement={
                <Input
                  size="large"
                  style={{ width: "100%" }}
                  disabled={body?.pix_refund_fee_type === "PERCENT"}
                  value={body?.pix_refund_fee_value}
                />
              }
            />
          </Form.Item>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Form.Item
            label={t("input.deposit_refund_fee_minimum_value")}
            name="pix_refund_fee_min"
          >
            <CurrencyInput
              data-test-id="deposit_refund_fee_min"
              onChangeValue={(_event, originalValue) => {
                setBody((state) => ({
                  ...state,
                  pix_refund_fee_min: +originalValue,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  pix_refund_fee_min: +originalValue,
                }));
              }}
              InputElement={
                <Input
                  size="large"
                  style={{ width: "100%" }}
                  value={body?.pix_refund_fee_min}
                />
              }
            />
          </Form.Item>
        </Grid>
        <Divider orientation="left">
          <Typography.Title level={3}>FastPix</Typography.Title>
        </Divider>

        <Grid item xs={12} sm={6} md={3}>
          <Form.Item
            label={t("input.fastpix_in_fee_type")}
            name="fastpix_in_fee_type"
          >
            <Select
              data-test-id="fastpix_in_fee_type"
              size="large"
              options={
                arrayPercentValue?.map((item, index) => ({
                  key: index,
                  value: item,
                  label: `${t(`table.${item.toLocaleLowerCase()}`)}`,
                })) ?? []
              }
              value={body?.fastpix_in_fee_type || null}
              onChange={(value) => {
                setBody((state) => ({
                  ...state,
                  fastpix_in_fee_type: value,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  fastpix_in_fee_type: value,
                }));
              }}
            />
          </Form.Item>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Form.Item
            label={t("input.fastpix_in_fee_percent")}
            name="fastpix_in_fee_percent"
          >
            <Input
              data-test-id="fastpix_in_fee_percent"
              size="large"
              type="number"
              name="fastpix_in_fee_percent"
              disabled={body?.fastpix_in_fee_type === "VALUE"}
              value={body?.fastpix_in_fee_percent}
              onChange={(e) => {
                setBody((state) => ({
                  ...state,
                  fastpix_in_fee_percent: Number(e.target.value),
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  fastpix_in_fee_percent: Number(e.target.value),
                }));
              }}
            />
          </Form.Item>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Form.Item
            label={t("input.fastpix_in_fee_value")}
            name="fastpix_in_fee_value"
          >
            <CurrencyInput
              data-test-id="fastpix_in_fee_value"
              onChangeValue={(_event, originalValue) => {
                setBody((state) => ({
                  ...state,
                  fastpix_in_fee_value: +originalValue,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  fastpix_in_fee_value: +originalValue,
                }));
              }}
              InputElement={
                <Input
                  size="large"
                  style={{ width: "100%" }}
                  disabled={body?.fastpix_in_fee_type === "PERCENT"}
                  value={body?.fastpix_in_fee_value}
                />
              }
            />
          </Form.Item>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Form.Item
            label={t("input.fastpix_in_fee_min")}
            name="fastpix_in_fee_min"
          >
            <CurrencyInput
              data-test-id="fastpix_in_fee_min"
              onChangeValue={(_event, originalValue) => {
                setBody((state) => ({
                  ...state,
                  fastpix_in_fee_min: +originalValue,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  fastpix_in_fee_min: +originalValue,
                }));
              }}
              InputElement={
                <Input
                  size="large"
                  style={{ width: "100%" }}
                  value={body?.fastpix_in_fee_min}
                />
              }
            />
          </Form.Item>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Form.Item
            label={t("input.fastpix_refund_fee_type")}
            name="fastpix_refund_fee_type"
          >
            <Select
              data-test-id="fastpix_refund_fee_type"
              size="large"
              options={
                arrayPercentValue?.map((item, index) => ({
                  key: index,
                  value: item,
                  label: `${t(`table.${item.toLocaleLowerCase()}`)}`,
                })) ?? []
              }
              value={body?.fastpix_refund_fee_type || null}
              onChange={(value) => {
                setBody((state) => ({
                  ...state,
                  fastpix_refund_fee_type: value,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  fastpix_refund_fee_type: value,
                }));
              }}
            />
          </Form.Item>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Form.Item
            label={t("input.fastpix_refund_fee_percent")}
            name="fastpix_refund_fee_percent"
          >
            <Input
              data-test-id="fastpix_refund_fee_percent"
              size="large"
              type="number"
              name="fastpix_refund_fee_percent"
              disabled={body?.fastpix_refund_fee_type === "VALUE"}
              value={body?.fastpix_refund_fee_percent}
              onChange={(e) => {
                setBody((state) => ({
                  ...state,
                  fastpix_refund_fee_percent: Number(e.target.value),
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  fastpix_refund_fee_percent: Number(e.target.value),
                }));
              }}
            />
          </Form.Item>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Form.Item
            label={t("input.fastpix_refund_fee_value")}
            name="fastpix_refund_fee_value"
          >
            <CurrencyInput
              data-test-id="fastpix_refund_fee_value"
              onChangeValue={(_event, originalValue) => {
                setBody((state) => ({
                  ...state,
                  fastpix_refund_fee_value: +originalValue,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  fastpix_refund_fee_value: +originalValue,
                }));
              }}
              InputElement={
                <Input
                  size="large"
                  style={{ width: "100%" }}
                  disabled={body?.fastpix_refund_fee_type === "PERCENT"}
                  value={body?.fastpix_refund_fee_value}
                />
              }
            />
          </Form.Item>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Form.Item
            label={t("input.fastpix_refund_fee_min")}
            name="fastpix_refund_fee_min"
          >
            <CurrencyInput
              data-test-id="fastpix_refund_fee_min"
              onChangeValue={(_event, originalValue) => {
                setBody((state) => ({
                  ...state,
                  fastpix_refund_fee_min: +originalValue,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  fastpix_refund_fee_min: +originalValue,
                }));
              }}
              InputElement={
                <Input
                  size="large"
                  style={{ width: "100%" }}
                  value={body?.fastpix_refund_fee_min}
                />
              }
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
            <button
              data-test-id="submit"
              type="submit"
              ref={submitRef}
              style={{ display: "none" }}
            >
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
