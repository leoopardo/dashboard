/* eslint-disable @typescript-eslint/no-explicit-any */
import { InfoCircleOutlined } from "@ant-design/icons";
import { Grid } from "@mui/material";
import { Toast } from "@src/components/Toast";
import { TuorComponent } from "@src/components/Tuor";
import { queryClient } from "@src/services/queryClient";
import { useGetGeneralconfigs } from "@src/services/register/organization/generalConfigs/getGeneralConfigs";
import { useUpdateOrganizationGeneralConfigs } from "@src/services/register/organization/generalConfigs/updateGeneralConfigs";
import { OrganizationGeneralConfigs } from "@src/services/types/register/organization/organizationGeneralConfigs.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { setFirstChildDivId } from "@src/utils/functions";
import {
  Button,
  Form,
  FormInstance,
  Input,
  Popconfirm,
  Select,
  Tabs,
  TabsProps,
  Tooltip,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { CurrencyInput } from "react-currency-mask";
import { useTranslation } from "react-i18next";

export const GeneralConfigs = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;

  const { t } = useTranslation();
  const { data, isFetching } = useGetGeneralconfigs();
  const [activeKey, setactiveKey] = useState<"1" | "2">(
    permissions.register.paybrokers.general_configs
      .general_configs_update_financial
      ? "1"
      : "2"
  );
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onChange = (key: "1" | "2") => {
    setactiveKey(key);
  };
  const formRef = useRef<FormInstance>(null);
  const [body, setBody] = useState<OrganizationGeneralConfigs>({ ...data });
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const { updateMutate, updateError, updateIsLoading, updateSuccess } =
    useUpdateOrganizationGeneralConfigs(body);
  const handleChange = (event: any) => {
    setBody((state) => ({
      ...state,
      [event.target.name]: Number(event.target.value),
    }));
  };

  const [isTuorOpen, setIsTuorOpen] = useState<boolean>(false);
  const refCashInMaxValue = useRef(null);
  const refCashInReceiveByPj = useRef(null);
  const refCashInMaxValueReceiveByPj = useRef(null);
  const refCashInReceiveByDiffrentPayer = useRef(null);
  const refCashInMaxValueReceiveByDiffrentPayer = useRef(null);
  const refCashOutMaxValue = useRef(null);
  const refCashInMaxValueByMonth = useRef(null);
  const refCashOutMaxValueByMonth = useRef(null);
  const refCashInPermission = useRef(null);
  const refAutoSwitchBanks = useRef(null);
  const refCashOutPermission = useRef(null);
  const refCheckLast = useRef(null);
  const refCallbackDeposit = useRef(null);
  const refCallbackWithdraw = useRef(null);
  const refCashInDisabledMessage = useRef(null);
  const refCashOutDisabledMessage = useRef(null);
  const reftimeToPreventRepeatedWithdraw = useRef(null);
  const refMaxValueToSwitchBankAcc = useRef(null);
  const refMinValueToSwitchBankAcc = useRef(null);
  const refCheckLastWaitinPix = useRef(null);
  const refPaybrokersQrCode = useRef(null);
  const refTimeReceiveAfterExpire = useRef(null);
  const tabFinancial = document.querySelector('[data-node-key="1"]');
  const tabAdmin = document.querySelector('[data-node-key="2"]');

  const handleSubmit = () => {
    delete body.id;
    delete body.organization_id;
    updateMutate();
    setIsConfirmOpen(false);
  };

  useEffect(() => {
    setFirstChildDivId(tabFinancial, "tab-financial");
    setFirstChildDivId(tabAdmin, "tab-admin");
  }, [tabFinancial, tabAdmin]);

  useEffect(() => {
    formRef.current?.setFieldsValue(data);
  }, [data]);

  const items: TabsProps["items"] | any = [
    permissions.register.paybrokers.general_configs
      .general_configs_update_financial && {
      key: "1",
      label: t("table.financial"),
      children: (
        <Form
          ref={formRef}
          layout="vertical"
          initialValues={data ? data : {}}
          onFinish={handleSubmit}
        >
          <Grid container spacing={1} style={{ display: "flex", alignItems: "end" }}>
            <Grid item xs={12} md={4} ref={refCashInMaxValue}>
              <Form.Item
                label={t("input.cash_in_max_value")}
                name="cash_in_max_value"
                rules={[
                  {
                    validator: () => {
                      const numericValue = body?.cash_in_max_value;

                      if (numericValue === 0) {
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
                  data-test-id="cash_in_max_value"
                  onChangeValue={(_event, originalValue) => {
                    setBody((state) => ({
                      ...state,
                      cash_in_max_value: +originalValue,
                    }));
                  }}
                  InputElement={
                    <Input
                      size="large"
                      style={{ width: "100%" }}
                      value={body?.cash_in_max_value}
                    />
                  }
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={2} ref={refCashInReceiveByPj}>
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
                  value={body.cash_in_receive_by_pj}
                  onChange={(_value, option: any) =>
                    setBody((state) => ({
                      ...state,
                      cash_in_receive_by_pj: option.value,
                    }))
                  }
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4} ref={refCashInMaxValueReceiveByPj}>
              <Form.Item
                label={t("input.cash_in_max_value_receive_by_pj")}
                name="cash_in_max_value_receive_by_pj"
                rules={[
                  {
                    validator: () => {
                      const numericValue =
                        body?.cash_in_max_value_receive_by_pj;

                      if (numericValue === 0) {
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
                  data-test-id="cash_in_max_value_receive_by_pj"
                  onChangeValue={(_event, originalValue) => {
                    setBody((state) => ({
                      ...state,
                      cash_in_max_value_receive_by_pj: +originalValue,
                    }));
                  }}
                  value={body?.cash_in_max_value_receive_by_pj}
                  InputElement={
                    <Input
                      size="large"
                      style={{ width: "100%" }}
                      value={body?.cash_in_max_value_receive_by_pj}
                    />
                  }
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={2} ref={refCashInReceiveByDiffrentPayer}>
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
                  value={body.cash_in_receive_by_different_payer}
                  onChange={(_value, option: any) =>
                    setBody((state) => ({
                      ...state,
                      cash_in_receive_by_different_payer: option.value,
                    }))
                  }
                />
              </Form.Item>
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              ref={refCashInMaxValueReceiveByDiffrentPayer}
            >
              <Form.Item
                label={t("input.cash_in_max_value_receive_by_different_payer")}
                name="cash_in_max_value_receive_by_different_payer"
                rules={[
                  {
                    validator: () => {
                      const numericValue =
                        body?.cash_in_max_value_receive_by_different_payer;

                      if (numericValue === 0) {
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
                  data-test-id="cash_in_max_value_receive_by_different_payer"
                  onChangeValue={(_event, originalValue) => {
                    setBody((state) => ({
                      ...state,
                      cash_in_max_value_receive_by_different_payer:
                        +originalValue,
                    }));
                  }}
                  value={body?.cash_in_max_value_receive_by_different_payer}
                  InputElement={
                    <Input
                      size="large"
                      style={{ width: "100%" }}
                      value={body?.cash_in_max_value_receive_by_different_payer}
                    />
                  }
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4} ref={refCashOutMaxValue}>
              <Form.Item
                label={t("input.cash_out_max_value")}
                name="cash_out_max_value"
                rules={[
                  {
                    validator: () => {
                      const numericValue = body?.cash_out_max_value;

                      if (numericValue === 0) {
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
                  data-test-id="cash_out_max_value"
                  onChangeValue={(_event, originalValue) => {
                    setBody((state) => ({
                      ...state,
                      cash_out_max_value: +originalValue,
                    }));
                  }}
                  value={body?.cash_out_max_value}
                  InputElement={
                    <Input
                      size="large"
                      style={{ width: "100%" }}
                      value={body?.cash_out_max_value}
                    />
                  }
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4} ref={refCashInMaxValueByMonth}>
              <Form.Item
                label={t("input.cash_in_max_value_by_month")}
                name="cash_in_max_value_by_month"
                rules={[
                  {
                    validator: () => {
                      const numericValue = body?.cash_in_max_value_by_month;

                      if (numericValue === 0) {
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
                  data-test-id="cash_in_max_value_by_month"
                  onChangeValue={(_event, originalValue) => {
                    setBody((state) => ({
                      ...state,
                      cash_in_max_value_by_month: +originalValue,
                    }));
                  }}
                  value={body?.cash_in_max_value_by_month}
                  InputElement={
                    <Input
                      size="large"
                      style={{ width: "100%" }}
                      value={body?.cash_in_max_value_by_month}
                    />
                  }
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4} ref={refCashOutMaxValueByMonth}>
              <Form.Item
                label={t("input.cash_out_max_value_by_month")}
                name="cash_out_max_value_by_month"
                rules={[
                  {
                    validator: () => {
                      const numericValue = body?.cash_out_max_value_by_month;

                      if (numericValue === 0) {
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
                  data-test-id="cash_out_max_value_by_month"
                  onChangeValue={(_event, originalValue) => {
                    setBody((state) => ({
                      ...state,
                      cash_out_max_value_by_month: +originalValue,
                    }));
                  }}
                  value={body?.cash_out_max_value_by_month}
                  InputElement={
                    <Input
                      size="large"
                      style={{ width: "100%" }}
                      value={body?.cash_out_max_value_by_month}
                    />
                  }
                />
              </Form.Item>
            </Grid>
          </Grid>
        </Form>
      ),
      style: {
        display: permissions.register.paybrokers.general_configs
          .general_configs_update_financial
          ? undefined
          : "none",
      },
      disabled:
        !permissions.register.paybrokers.general_configs
          .general_configs_update_financial,
    },
    permissions.register.paybrokers.general_configs
      .general_configs_update_adminstrative && {
      key: "2",
      label: t("table.administrative"),
      children: (
        <Form
          ref={formRef}
          layout="vertical"
          initialValues={data ? data : {}}
          onFinish={handleSubmit}
        >
          <Grid
            container
            spacing={1}
            style={{ display: "flex", alignItems: "flex-end" }}
          >
            <Grid item xs={12} md={2} ref={refCashInPermission}>
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
                  value={body.cash_in_permission}
                  onChange={(_value, option: any) =>
                    setBody((state) => ({
                      ...state,
                      cash_in_permission: option.value,
                    }))
                  }
                />
              </Form.Item>
            </Grid>{" "}
            <Grid item xs={12} md={2} ref={refAutoSwitchBanks}>
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
                  value={body.auto_switch_bank_acc}
                  onChange={(_value, option: any) =>
                    setBody((state) => ({
                      ...state,
                      auto_switch_bank_acc: option.value,
                    }))
                  }
                />
              </Form.Item>
            </Grid>{" "}
            <Grid item xs={12} md={2} ref={refCashOutPermission}>
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
                  value={body.cash_out_permission}
                  onChange={(_value, option: any) =>
                    setBody((state) => ({
                      ...state,
                      cash_out_permission: option.value,
                    }))
                  }
                />
              </Form.Item>
            </Grid>{" "}
            <Grid item xs={12} md={2} ref={refCheckLast}>
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
                  value={body.check_last_waiting_pix}
                  onChange={(_value, option: any) =>
                    setBody((state) => ({
                      ...state,
                      check_last_waiting_pix: option.value,
                    }))
                  }
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={2} ref={refCallbackDeposit}>
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
                  value={body.callback_deposit_api_enable}
                  onChange={(_value, option: any) =>
                    setBody((state) => ({
                      ...state,
                      callback_deposit_api_enable: option.value,
                    }))
                  }
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={2} ref={refCallbackWithdraw}>
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
                  value={body.callback_withdraw_api_enable}
                  onChange={(_value, option: any) =>
                    setBody((state) => ({
                      ...state,
                      callback_withdraw_api_enable: option.value,
                    }))
                  }
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4} ref={refCashInDisabledMessage}>
              <Form.Item
                label={t("input.cash_in_disabled_message")}
                name="cash_in_disabled_message"
              >
                <Input
                  size="large"
                  name="cash_in_disabled_message"
                  value={body.cash_in_disabled_message}
                  onChange={handleChange}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4} ref={refCashOutDisabledMessage}>
              <Form.Item
                label={t("input.cash_out_disabled_message")}
                name="cash_out_disabled_message"
              >
                <Input
                  size="large"
                  name="cash_out_disabled_message"
                  value={body.cash_out_disabled_message}
                  onChange={handleChange}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4} ref={reftimeToPreventRepeatedWithdraw}>
              <Form.Item
                label={t("input.time_to_prevent_repeated_withdraw_minutes")}
                name="time_to_prevent_repeated_withdraw_minutes"
                rules={[
                  {
                    validator: () => {
                      const numericValue =
                        body?.time_to_prevent_repeated_withdraw_minutes;

                      if (numericValue === 0) {
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
                  size="large"
                  name="time_to_prevent_repeated_withdraw_minutes"
                  value={body.time_to_prevent_repeated_withdraw_minutes}
                  onChange={handleChange}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4} ref={refMaxValueToSwitchBankAcc}>
              <Form.Item
                label={t("input.max_value_to_switch_bank_acc")}
                name="max_value_to_switch_bank_acc"
              >
                <Input
                  type="number"
                  size="large"
                  name="max_value_to_switch_bank_acc"
                  value={body.max_value_to_switch_bank_acc}
                  onChange={handleChange}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4} ref={refMinValueToSwitchBankAcc}>
              <Form.Item
                label={t("input.min_value_to_switch_bank_acc")}
                name="min_value_to_switch_bank_acc"
              >
                <Input
                  type="number"
                  size="large"
                  name="min_value_to_switch_bank_acc"
                  value={body.min_value_to_switch_bank_acc}
                  onChange={handleChange}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4} ref={refCheckLastWaitinPix}>
              <Form.Item
                label={t("input.check_last_waiting_pix_time_minutes")}
                name="check_last_waiting_pix_time_minutes"
                rules={[
                  {
                    validator: () => {
                      const numericValue =
                        body?.check_last_waiting_pix_time_minutes;

                      if (numericValue === 0) {
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
                  size="large"
                  name="check_last_waiting_pix_time_minutes"
                  value={body.check_last_waiting_pix_time_minutes}
                  onChange={handleChange}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4} ref={refPaybrokersQrCode}>
              <Form.Item
                label={t("input.paybrokers_qr_code_expire_hours")}
                name="paybrokers_qr_code_expire_hours"
                rules={[
                  {
                    validator: () => {
                      const numericValue =
                        body?.paybrokers_qr_code_expire_hours;

                      if (numericValue === 0) {
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
                  size="large"
                  name="paybrokers_qr_code_expire_hours"
                  value={body.paybrokers_qr_code_expire_hours}
                  onChange={handleChange}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4} ref={refTimeReceiveAfterExpire}>
              <Form.Item
                label={t("input.time_receive_after_expire_qr_code_hours")}
                name="time_receive_after_expire_qr_code_hours"
                rules={[
                  {
                    validator: () => {
                      const numericValue =
                        body?.time_receive_after_expire_qr_code_hours;

                      if (numericValue === 0) {
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
                  size="large"
                  name="time_receive_after_expire_qr_code_hours"
                  value={body.time_receive_after_expire_qr_code_hours}
                  onChange={handleChange}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4} ref={refTimeReceiveAfterExpire}>
              <Form.Item
                label={t("input.fastpix_qr_code_expire_seconds")}
                name="fastpix_qr_code_expire_seconds"
                rules={[
                  {
                    validator: () => {
                      const numericValue = body?.fastpix_qr_code_expire_seconds;

                      if (numericValue === 0) {
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
                  size="large"
                  name="fastpix_qr_code_expire_seconds"
                  value={body.fastpix_qr_code_expire_seconds}
                  onChange={handleChange}
                />
              </Form.Item>
            </Grid>
          </Grid>
        </Form>
      ),
      style: {
        display: permissions.register.paybrokers.general_configs
          .general_configs_update_adminstrative
          ? undefined
          : "none",
      },
      disabled:
        !permissions.register.paybrokers.general_configs
          .general_configs_update_adminstrative,
    },
  ];

  return (
    <Grid
      container
      style={{
        padding: "25px",
        paddingTop: 0,
        display: "flex",
      }}
    >
      <Grid
        item
        xs={12}
        md={12}
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <Tooltip title={t("buttons.help")}>
          <Button
            type="link"
            onClick={() => {
              setactiveKey("1");
              setIsTuorOpen((state) => !state);
            }}
          >
            <InfoCircleOutlined />
          </Button>
        </Tooltip>
      </Grid>
      <Grid item xs={12}>
        <Tabs
          defaultActiveKey={
            permissions.register.paybrokers.general_configs
              .general_configs_update_financial
              ? "1"
              : "2"
          }
          activeKey={activeKey}
          items={items}
          onChange={(key: any) => onChange(key)}
        />
      </Grid>
      <Grid
        item
        container
        xs={12}
        style={{ display: "flex", flexDirection: "row-reverse" }}
      >
        <Grid item xs={12} md={4} lg={3}>
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
              formRef.current?.submit();
            }}
            okButtonProps={{ loading: updateIsLoading }}
            okText={t("messages.yes_update")}
            cancelText={t("messages.no_cancel")}
            onCancel={() => setIsConfirmOpen(false)}
          >
            <Button
              size="large"
              type="primary"
              style={{ width: "100%" }}
              loading={isFetching || updateIsLoading}
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
        error={updateError}
        success={updateSuccess}
      />

      <TuorComponent
        open={isTuorOpen}
        setOpen={setIsTuorOpen}
        steps={[
          {
            title: t("input.cash_in_max_value"),
            description: t("wiki.cash_in_max_value_description"),
            target: () => refCashInMaxValue.current,
          },
          {
            title: t("input.cash_in_receive_by_pj"),
            description: t("wiki.cash_in_receive_by_pj_description"),
            target: () => refCashInReceiveByPj.current,
          },
          {
            title: t("input.cash_in_max_value_receive_by_pj"),
            description: t("wiki.cash_in_max_value_receive_by_pj_description"),
            target: () => refCashInMaxValueReceiveByPj.current,
          },
          {
            title: t("input.cash_in_receive_by_different_payer"),
            description: t(
              "wiki.cash_in_receive_by_different_payer_description"
            ),
            target: () => refCashInReceiveByDiffrentPayer.current,
          },
          {
            title: t("input.cash_in_max_value_receive_by_different_payer"),
            description: t(
              "wiki.cash_in_max_value_receive_by_different_payer_description"
            ),
            target: () => refCashInMaxValueReceiveByDiffrentPayer.current,
          },
          {
            title: t("input.cash_out_max_value"),
            description: t("wiki.cash_out_max_value_description"),
            target: () => refCashOutMaxValue.current,
          },
          {
            title: t("input.cash_in_max_value_by_month"),
            description: t("wiki.cash_in_max_value_by_month_description"),
            target: () => refCashInMaxValueByMonth.current,
          },
          {
            title: t("input.cash_out_max_value_by_month"),
            description: t("wiki.cash_out_max_value_by_month_description"),
            target: () => refCashOutMaxValueByMonth.current,
            nextButtonProps: {
              onClick: () => setactiveKey("2"),
            },
          },
          {
            title: t("input.cash_in_permission"),
            description: t("wiki.cash_in_permission_description"),
            target: () => refCashInPermission.current,
            prevButtonProps: {
              onClick: () => setactiveKey("1"),
            },
          },
          {
            title: t("input.auto_switch_bank_acc"),
            description: t("wiki.auto_switch_bank_acc_description"),
            target: () => refAutoSwitchBanks.current,
          },
          {
            title: t("input.cash_out_permission"),
            description: t("wiki.cash_out_permission_description"),
            target: () => refCashOutPermission.current,
          },
          {
            title: t("input.check_last_waiting_pix"),
            description: t("wiki.check_last_waiting_pix_description"),
            target: () => refCheckLast.current,
          },
          {
            title: t("input.callback_deposit_api_enable"),
            description: t("wiki.callback_deposit_api_enable_description"),
            target: () => refCallbackDeposit.current,
          },
          {
            title: t("input.callback_withdraw_api_enable"),
            description: t("wiki.callback_withdraw_api_enable_description"),
            target: () => refCallbackWithdraw.current,
          },
          {
            title: t("input.cash_in_disabled_message"),
            description: t("wiki.cash_in_disabled_message_description"),
            target: () => refCashInDisabledMessage.current,
          },
          {
            title: t("input.cash_out_disabled_message"),
            description: t("wiki.cash_out_disabled_message_description"),
            target: () => refCashOutDisabledMessage.current,
          },
          {
            title: t("input.time_to_prevent_repeated_withdraw_minutes"),
            description: t(
              "wiki.time_to_prevent_repeated_withdraw_minutes_description"
            ),
            target: () => reftimeToPreventRepeatedWithdraw.current,
          },
          {
            title: t("input.max_value_to_switch_bank_acc"),
            description: t("wiki.max_value_to_switch_bank_acc_description"),
            target: () => refMaxValueToSwitchBankAcc.current,
          },
          {
            title: t("input.min_value_to_switch_bank_acc"),
            description: t("wiki.min_value_to_switch_bank_acc_description"),
            target: () => refMinValueToSwitchBankAcc.current,
          },
          {
            title: t("input.check_last_waiting_pix_time_minutes"),
            description: t(
              "wiki.check_last_waiting_pix_time_minutes_description"
            ),
            target: () => refCheckLastWaitinPix.current,
          },
          {
            title: t("input.paybrokers_qr_code_expire_hours"),
            description: t("wiki.paybrokers_qr_code_expire_hours_description"),
            target: () => refPaybrokersQrCode.current,
          },
          {
            title: t("input.time_receive_after_expire_qr_code_hours"),
            description: t(
              "wiki.time_receive_after_expire_qr_code_hours_description"
            ),
            target: () => refTimeReceiveAfterExpire.current,
          },
        ]}
        pageStep={{
          title: t("menus.general_configs"),
          description: t("wiki.general_configs_description"),
        }}
      />
    </Grid>
  );
};
