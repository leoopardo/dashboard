/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Toast } from "@components/Toast";
import { Grid } from "@mui/material";
import { useMerchantConfig } from "@src/services/register/merchant/merchant/merchantConfig.tsx/getMerchantConfig";
import { useUpdateMerchantConfig } from "@src/services/register/merchant/merchant/merchantConfig.tsx/updateMerchantConfig";
import { IMerchantConfig } from "@src/services/types/register/merchants/merchantConfig.interface";
import { Button, Form, FormInstance, Input, Popconfirm, Select } from "antd";
import { useEffect, useRef, useState } from "react";
import { CurrencyInput } from "react-currency-mask";
import { useTranslation } from "react-i18next";

export const FastPixConfigTab = (props: { id?: string }) => {
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
  const { UpdateIsSuccess, UpdateMutate, UpdateError } =
    useUpdateMerchantConfig({
      merchant_id: Number(props?.id),
      ...bodyUpdate,
    });

  const handleSubmit = () => {
    UpdateMutate();
    setIsConfirmOpen(false);
  };

  useEffect(() => {
    refetchMerchantConfigData();
  }, [UpdateIsSuccess]);

  useEffect(() => {
    formRef.current?.setFieldsValue(merchantConfigData);
  }, [merchantConfigData]);

  return (
    <Form
      ref={formRef}
      layout="vertical"
      onSubmitCapture={() => handleSubmit()}
      initialValues={merchantConfigData ?? {}}
    >
      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          <Form.Item
            label={t("input.fastpix_in_permission")}
            name="fastpix_in_permission"
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
              value={body?.fastpix_in_permission}
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
        <Grid item xs={12} md={6}>
          <Form.Item label={t("input.fastpix_in_type")} name="fastpix_in_type">
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
        <Grid item xs={12} md={6}>
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
        <Grid item xs={12} md={6}>
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
