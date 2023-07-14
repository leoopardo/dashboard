/* eslint-disable @typescript-eslint/no-explicit-any */
import { MerchantSelect } from "@src/components/Selects/merchantSelect";
import { PartnerSelect } from "@src/components/Selects/partnerSelect";
import { queryClient } from "@src/services/queryClient";
import { ResendWebhookBody } from "@src/services/types/consult/deposits/createResendWebhook.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import {
  Button,
  ConfigProvider,
  DatePicker,
  Drawer,
  Form,
  FormInstance,
  Radio,
} from "antd";
import locale from "antd/locale/pt_BR";
import dayjs from "dayjs";
import moment from "moment";
import { Dispatch, SetStateAction, useRef } from "react";
import { useTranslation } from "react-i18next";
const { RangePicker } = DatePicker;

interface ResendWebhookModalInterface {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setBody: Dispatch<SetStateAction<ResendWebhookBody>>;
  body: ResendWebhookBody;
  submit: () => void;
}

export const ResendWebhookModal = ({
  open,
  setOpen,
  submit,
  body,
  setBody,
}: ResendWebhookModalInterface) => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const { t } = useTranslation();
  const formRef = useRef<FormInstance>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  const handleChange = (event: any) => {
    setBody((state) => ({ ...state, [event.target.name]: event.target.value }));
  };

  return (
    <Drawer
      open={open}
      onClose={() => setOpen(false)}
      title={t("modal.resend_webhook")}
      placement="right"
      bodyStyle={{ overflowX: "hidden" }}
      footer={
        <Button
          type="primary"
          onClick={() => {
            submitRef.current?.click();
          }}
          style={{ width: "100%", height: "50px" }}
        >
          {t("modal.resend_webhook")}
        </Button>
      }
    >
      <Form
        ref={formRef}
        layout="vertical"
        onFinish={() => {
          submit();
          setOpen(false);
        }}
      >
        <Form.Item label={t("input.webhook_type")} style={{ margin: 10 }}>
          <Radio.Group
            onChange={handleChange}
            value={body.webhook_url_type}
            name="webhook_url_type"
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
            size="large"
          >
            <Radio value="primary">{t("input.primary")}</Radio>
            <Radio value="secondary">{t("input.secondary")}</Radio>
            <Radio value="both">{t("input.both")}</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label={t("table.date")}
          style={{ margin: 10 }}
          name="start_date"
          rules={[
            {
              validator: () => {
                if (
                  body.end_date >
                  moment(new Date(body.start_date))
                    .add(2, "hours")
                    .format("YYYY-MM-DDTHH:mm:00.000")
                ) {
                  return Promise.reject(t("error.date_1_hour"));
                } else return Promise.resolve();
              },
            },
          ]}
        >
          <ConfigProvider locale={locale}>
            <RangePicker
              size="small"
              format="YYYY-MM-DD HH:mm:ss"
              showTime
              value={[
                dayjs(body.start_date, "YYYY-MM-DD HH:mm:ss"),
                dayjs(body.end_date, "YYYY-MM-DD HH:mm:ss"),
              ]}
              clearIcon={<></>}
              popupStyle={{ marginLeft: "40px" }}
              style={{
                width: "100%",
                height: "40px",
              }}
              placeholder={[t("table.initial_date"), t("table.final_date")]}
              onChange={(value: any) => {
                setBody((state: any) => ({
                  ...state,
                  start_date: moment(value[0]?.$d).format(
                    "YYYY-MM-DDTHH:mm:ss.SSS"
                  ),
                  end_date: moment(value[1]?.$d).format(
                    "YYYY-MM-DDTHH:mm:ss.SSS"
                  ),
                }));
                formRef?.current?.validateFields();
              }}
            />
          </ConfigProvider>
        </Form.Item>
        {permissions.register.partner.partner.partner_list && (
          <Form.Item
            label={t("table.partner")}
            style={{ margin: 10 }}
            rules={[{ required: !body.partner_id }]}
          >
            <PartnerSelect queryOptions={body} setQueryFunction={setBody} />
          </Form.Item>
        )}
        {permissions.register.merchant.merchant.merchant_list && (
          <Form.Item
            label={t("table.merchant")}
            style={{ margin: 10 }}
            rules={[{ required: !body.merchant_id }]}
          >
            <MerchantSelect queryOptions={body} setQueryFunction={setBody} />
          </Form.Item>
        )}

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <button type="submit" ref={submitRef} style={{ display: "none" }}>
            Submit
          </button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};
