import { Grid } from "@mui/material";
import { useGetGeneralconfigs } from "@src/services/register/organization/generalConfigs/getGeneralConfigs";
import { Form, FormInstance, Input, Select, Spin, Tabs, TabsProps } from "antd";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";

export const GeneralConfigs = () => {
  const { t } = useTranslation();
  const { data, error, isFetching, isSuccess, refetch } =
    useGetGeneralconfigs();
  const onChange = (key: string) => {
    console.log(key);
  };
  const formRef = useRef<FormInstance>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: t("table.financial"),
      children: (
        <Form ref={formRef} layout="vertical">
          <Grid container spacing={1}>
            <Grid item xs={12} md={4}>
              <Form.Item
                label={t("input.cash_in_max_value")}
                name="cash_in_max_value"
              >
                <Input size="large" name="cash_in_max_value" />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={2}>
              <Form.Item
                label={t("input.cash_in_receive_by_pj")}
                name="cash_in_receive_by_pj"
              >
                <Select
                  size="large"
                  options={[
                    { value: true, label: t("table.true") },
                    { value: false, label: t("table.false") },
                  ]}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4}>
              <Form.Item
                label={t("input.cash_in_max_value_receive_by_pj")}
                name="cash_in_max_value_receive_by_pj"
              >
                <Input size="large" name="cash_in_max_value_receive_by_pj" />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={2}>
              <Form.Item
                label={t("input.cash_in_receive_by_different_payer")}
                name="cash_in_receive_by_different_payer"
              >
                <Select
                  size="large"
                  options={[
                    { value: true, label: t("table.true") },
                    { value: false, label: t("table.false") },
                  ]}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4}>
              <Form.Item
                label={t("input.cash_in_max_value_receive_by_different_payer")}
                name="cash_in_max_value_receive_by_different_payer"
              >
                <Input
                  size="large"
                  name="cash_in_max_value_receive_by_different_payer"
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4}>
              <Form.Item
                label={t("input.cash_out_max_value")}
                name="cash_out_max_value"
              >
                <Input size="large" name="cash_out_max_value" />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4}>
              <Form.Item
                label={t("input.cash_in_max_value_by_month")}
                name="cash_in_max_value_by_month"
              >
                <Input size="large" name="cash_in_max_value_by_month" />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4}>
              <Form.Item
                label={t("input.cash_out_max_value_by_month")}
                name="cash_out_max_value_by_month"
              >
                <Input size="large" name="cash_out_max_value_by_month" />
              </Form.Item>
            </Grid>
          </Grid>
        </Form>
      ),
    },
    {
      key: "2",
      label: t("table.administrative"),
      children: (
        <Form ref={formRef} layout="vertical" initialValues={data ? data : {}}>
          <Grid
            container
            spacing={1}
            style={{ display: "flex", alignItems: "flex-end" }}
          >
            <Grid item xs={12} md={2}>
              <Form.Item
                label={t("input.cash_in_permission")}
                name="cash_in_permission"
              >
                <Select
                  size="large"
                  options={[
                    { value: true, label: t("table.true") },
                    { value: false, label: t("table.false") },
                  ]}
                />
              </Form.Item>
            </Grid>{" "}
            <Grid item xs={12} md={2}>
              <Form.Item
                label={t("input.auto_switch_bank_acc")}
                name="auto_switch_bank_acc"
              >
                <Select
                  size="large"
                  options={[
                    { value: true, label: t("table.true") },
                    { value: false, label: t("table.false") },
                  ]}
                />
              </Form.Item>
            </Grid>{" "}
            <Grid item xs={12} md={2}>
              <Form.Item
                label={t("input.cash_out_permission")}
                name="cash_out_permission"
              >
                <Select
                  size="large"
                  options={[
                    { value: true, label: t("table.true") },
                    { value: false, label: t("table.false") },
                  ]}
                />
              </Form.Item>
            </Grid>{" "}
            <Grid item xs={12} md={2}>
              <Form.Item
                label={t("input.check_last_waiting_pix")}
                name="check_last_waiting_pix"
              >
                <Select
                  size="large"
                  options={[
                    { value: true, label: t("table.true") },
                    { value: false, label: t("table.false") },
                  ]}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={2}>
              <Form.Item
                label={t("input.callback_deposit_api_enable")}
                name="callback_deposit_api_enable"
              >
                <Select
                  size="large"
                  options={[
                    { value: true, label: t("table.true") },
                    { value: false, label: t("table.false") },
                  ]}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={2}>
              <Form.Item
                label={t("input.callback_withdraw_api_enable")}
                name="callback_withdraw_api_enable"
              >
                <Select
                  size="large"
                  options={[
                    { value: true, label: t("table.true") },
                    { value: false, label: t("table.false") },
                  ]}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4}>
              <Form.Item
                label={t("input.cash_in_disabled_message")}
                name="cash_in_disabled_message"
              >
                <Input size="large" name="cash_in_disabled_message" />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4}>
              <Form.Item
                label={t("input.cash_out_disabled_message")}
                name="cash_out_disabled_message"
              >
                <Input size="large" name="cash_out_disabled_message" />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4}>
              <Form.Item
                label={t("input.time_to_prevent_repeated_withdraw_minutes")}
                name="time_to_prevent_repeated_withdraw_minutes"
              >
                <Input
                  size="large"
                  name="time_to_prevent_repeated_withdraw_minutes"
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4}>
              <Form.Item
                label={t("input.max_value_to_switch_bank_acc")}
                name="max_value_to_switch_bank_acc"
              >
                <Input size="large" name="max_value_to_switch_bank_acc" />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4}>
              <Form.Item
                label={t("input.min_value_to_switch_bank_acc")}
                name="min_value_to_switch_bank_acc"
              >
                <Input size="large" name="min_value_to_switch_bank_acc" />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4}>
              <Form.Item
                label={t("input.check_last_waiting_pix_time_minutes")}
                name="check_last_waiting_pix_time_minutes"
              >
                <Input
                  size="large"
                  name="check_last_waiting_pix_time_minutes"
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4}>
              <Form.Item
                label={t("input.paybrokers_qr_code_expire_hours")}
                name="paybrokers_qr_code_expire_hours"
              >
                <Input size="large" name="paybrokers_qr_code_expire_hours" />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4}>
              <Form.Item
                label={t("input.time_receive_after_expire_qr_code_hours")}
                name="time_receive_after_expire_qr_code_hours"
              >
                <Input
                  size="large"
                  name="time_receive_after_expire_qr_code_hours"
                />
              </Form.Item>
            </Grid>
          </Grid>
        </Form>
      ),
    },
  ];

  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid item xs={12}>
        {isFetching ? (
          <Spin tip={t("table.loading")} />
        ) : (
          <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        )}
      </Grid>
    </Grid>
  );
};
