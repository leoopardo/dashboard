import { Grid } from "@mui/material";
import { Toast } from "@src/components/Toast";
import { useMerchantBankConfig } from "@src/services/register/merchant/merchant/bankConfig/getBankConfig";
import { useUpdateOrganizationGeneralConfigs } from "@src/services/register/organization/generalConfigs/updateGeneralConfigs";
import {
  Button,
  Form,
  FormInstance,
  Input,
  Popconfirm,
  Select,
  Tabs,
  TabsProps,
} from "antd";
import { MerchantBankResponse } from "@src/services/types/register/merchants/merchantBankConfig";
import { useRef, useState, useEffect } from "react";
import { BanksTab } from "./tabs/banks";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export const MerchantConfigs = () => {
  const { t } = useTranslation();
  const params = useParams()
  const { isMerchantBankFetching, merchantBankData, merchantBankError } =
    useMerchantBankConfig(params?.id || '');
  const onChange = (key: string) => {
    console.log(key);
  };
  const formRef = useRef<FormInstance>(null);
  const [body, setBody] = useState<MerchantBankResponse | null>(merchantBankData || null);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
/*   const { updateMutate, updateError, updateIsLoading, updateSuccess } =
    useUpdateOrganizationGeneralConfigs(body); */
 /*  const handleChange = (event: any) => {
    setBody((state) => ({
      ...state,
      [event.target.name]: Number(event.target.value),
    }));
  }; */

/*   useEffect(() => {
    formRef.current?.setFieldsValue(data);
  }, [data]); */

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: t("table.banks"),
      children: (
         <BanksTab id={params.id} />
      ),
    },
   /*  {
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
                  value={body.cash_out_permission}
                  onChange={(value, option: any) =>
                    setBody((state) => ({
                      ...state,
                      cash_out_permission: option.value,
                    }))
                  }
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
                  value={body.check_last_waiting_pix}
                  onChange={(value, option: any) =>
                    setBody((state) => ({
                      ...state,
                      check_last_waiting_pix: option.value,
                    }))
                  }
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
                  value={body.callback_deposit_api_enable}
                  onChange={(value, option: any) =>
                    setBody((state) => ({
                      ...state,
                      callback_deposit_api_enable: option.value,
                    }))
                  }
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
                  value={body.callback_withdraw_api_enable}
                  onChange={(value, option: any) =>
                    setBody((state) => ({
                      ...state,
                      callback_withdraw_api_enable: option.value,
                    }))
                  }
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4}>
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
            <Grid item xs={12} md={4}>
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
            <Grid item xs={12} md={4}>
              <Form.Item
                label={t("input.time_to_prevent_repeated_withdraw_minutes")}
                name="time_to_prevent_repeated_withdraw_minutes"
              >
                <Input
                  size="large"
                  name="time_to_prevent_repeated_withdraw_minutes"
                  value={body.time_to_prevent_repeated_withdraw_minutes}
                  onChange={handleChange}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4}>
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
            <Grid item xs={12} md={4}>
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
            <Grid item xs={12} md={4}>
              <Form.Item
                label={t("input.check_last_waiting_pix_time_minutes")}
                name="check_last_waiting_pix_time_minutes"
              >
                <Input
                  size="large"
                  name="check_last_waiting_pix_time_minutes"
                  value={body.check_last_waiting_pix_time_minutes}
                  onChange={handleChange}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4}>
              <Form.Item
                label={t("input.paybrokers_qr_code_expire_hours")}
                name="paybrokers_qr_code_expire_hours"
              >
                <Input
                  size="large"
                  name="paybrokers_qr_code_expire_hours"
                  value={body.paybrokers_qr_code_expire_hours}
                  onChange={handleChange}
                />
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
                  value={body.time_receive_after_expire_qr_code_hours}
                  onChange={handleChange}
                />
              </Form.Item>
            </Grid>
          </Grid>
        </Form>
      ),
    }, */
  ];

  return (
    <Grid
    container
    style={{
      padding: "25px",
      display: "flex",
    }}
  >
    <Grid item xs={12}>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </Grid>
    {/* <Grid
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
             // updateMutate();
              setIsConfirmOpen(false);
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
    /> */}
  </Grid>
  );
};
