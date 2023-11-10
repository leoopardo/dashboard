/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Toast } from "@components/Toast";
import { Grid } from "@mui/material";
import { useMerchantConfig } from "@src/services/register/merchant/merchant/merchantConfig.tsx/getMerchantConfig";
import { useUpdateMerchantConfig } from "@src/services/register/merchant/merchant/merchantConfig.tsx/updateMerchantConfig";
import { IMerchantConfig } from "@src/services/types/register/merchants/merchantConfig.interface";
import {
  Button,
  Divider,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Popconfirm,
  Select,
  Switch,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { CurrencyInput } from "react-currency-mask";
import { useTranslation } from "react-i18next";

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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const cashoutLimits = [null, 1, 2, 3, 4, 5];
  const { UpdateIsSuccess, UpdateMutate, UpdateError } =
    useUpdateMerchantConfig({ merchant_id: Number(props?.id), ...bodyUpdate });

  const handleSubmit = () => {
    UpdateMutate();
    setIsConfirmOpen(false);
  };

  useEffect(() => {
    refetchMerchantConfigData();
  }, [UpdateIsSuccess]);

  useEffect(() => {
    formRef.current?.setFieldsValue(merchantConfigData?.merchantConfig);
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
        <Grid
          item
          container
          xs={12}
          spacing={1}
          style={{ display: "flex", alignItems: "flex-end" }}
        >
          <Grid item xs={12}>
            <Divider>FastPix</Divider>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={12} md={2}>
              <Form.Item
                label={t("input.fastpix_in_permission")}
                name="fastpix_in_permission"
                valuePropName="checked"
              >
                <Switch
                  checked={body?.fastpix_in_permission}
                  onChange={(value) => {
                    setBody((state) => ({
                      ...state,
                      fastpix_in_permission: value,
                    }));
                    setBodyUpdate((state) => ({
                      ...state,
                      fastpix_in_permission: value,
                    }));
                  }}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={3}>
              <Form.Item
                label={t("input.fastpix_in_type")}
                name="fastpix_in_type"
              >
                <Select
                  size="large"
                  options={
                    ["fixed", "free"]?.map((item, index) => ({
                      key: index,
                      value: item,
                      label: `${t(`table.${item}`)}`,
                    })) ?? []
                  }
                  value={body?.fastpix_in_type}
                  onChange={(value) => {
                    setBody((state) => ({
                      ...state,
                      fastpix_in_type: value,
                    }));
                    setBodyUpdate((state) => ({
                      ...state,
                      fastpix_in_type: value,
                    }));
                  }}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={3}>
              <Form.Item
                label={t("input.fastpix_in_fixed_min_value")}
                name="fastpix_in_fixed_min_value"
              >
                <CurrencyInput
                  onChangeValue={(_event, originalValue) => {
                    setBodyUpdate((state) => ({
                      ...state,
                      fastpix_in_fixed_min_value: +originalValue,
                    }));
                  }}
                  InputElement={
                    <Input
                      size="large"
                      style={{ width: "100%" }}
                      value={body?.fastpix_in_fixed_min_value}
                    />
                  }
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4}>
              <Form.Item
                label={t("input.fastpix_in_max_value")}
                name="fastpix_in_max_value"
              >
                <CurrencyInput
                  onChangeValue={(_event, originalValue) => {
                    setBodyUpdate((state) => ({
                      ...state,
                      fastpix_in_max_value: +originalValue,
                    }));
                  }}
                  InputElement={
                    <Input
                      size="large"
                      style={{ width: "100%" }}
                      value={body?.fastpix_in_max_value}
                    />
                  }
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={5}>
              <Form.Item
                label={t("table.fastpix_webhook_url")}
                name="fastpix_webhook_url"
              >
                <Input
                  size="large"
                  name="fastpix_webhook_url"
                  value={body?.fastpix_webhook_url}
                  onChange={(e) => {
                    setBody((state) => ({
                      ...state,
                      fastpix_webhook_url: e.target.value,
                    }));
                    setBodyUpdate((state) => ({
                      ...state,
                      fastpix_webhook_url: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={5}>
              <Form.Item
                label={t("table.fastpix_redirect_url")}
                name="fastpix_redirect_url"
              >
                <Input
                  size="large"
                  name="fastpix_redirect_url"
                  value={body?.fastpix_redirect_url}
                  onChange={(e) => {
                    setBody((state) => ({
                      ...state,
                      fastpix_redirect_url: e.target.value,
                    }));
                    setBodyUpdate((state) => ({
                      ...state,
                      fastpix_redirect_url: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={2}>
              <Form.Item
                label={t("table.fastpix_token_time")}
                name="fastpix_token_time"
              >
                <InputNumber
                  style={{ width: "100%" }}
                  size="large"
                  name="fastpix_token_time"
                  value={body?.fastpix_token_time}
                  onChange={(value) => {
                    setBody((state) => ({
                      ...state,
                      fastpix_token_time: value ?? 0,
                    }));
                    setBodyUpdate((state) => ({
                      ...state,
                      fastpix_token_time: value ?? 0,
                    }));
                  }}
                />
              </Form.Item>
            </Grid>
          </Grid>
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
