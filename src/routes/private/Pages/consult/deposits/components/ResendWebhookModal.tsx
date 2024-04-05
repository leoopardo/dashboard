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
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
const { RangePicker } = DatePicker;

interface ResendWebhookModalInterface {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setBody: Dispatch<SetStateAction<ResendWebhookBody>>;
  body: ResendWebhookBody;
  submit: () => void;
  id?: string;
  setId?: Dispatch<SetStateAction<string>>;
}

export const ResendWebhookModal = ({
  open,
  setOpen,
  submit,
  body,
  setBody,
  id,
  setId,
}: ResendWebhookModalInterface) => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const { t } = useTranslation();
  const formRef = useRef<FormInstance>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const [entity, setEntity] = useState<"merchant" | "partner">("merchant");

  const handleChange = (event: any) => {
    setBody((state) => ({ ...state, [event.target.name]: event.target.value }));
  };
  return (
    <Drawer
      open={open}
      onClose={() => {
        setOpen(false);
        if (setId) {
          setId("");
        }
      }}
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
          if (setId) {
            setId("");
          }
        }}
      >
        <Form.Item label={t("table.status")} style={{ margin: 10 }}>
          <Radio.Group
            onChange={(e) => {
              setBody((state) => ({
                ...state,
                delivered_at: e.target.value === "not_delivered" ? false : true,
              }));
              formRef?.current?.validateFields(["start_date", "end_date"]);
            }}
            value={body.delivered_at ? "delivered" : "not_delivered"}
            name="webhook_url_type"
            size="large"
          >
            <Radio value="delivered">{t("messages.delivered")}</Radio>
            <Radio value="not_delivered">{t("messages.not_delivered")}</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label={t("input.webhook_type")} style={{ margin: 10 }}>
          <Radio.Group
            onChange={handleChange}
            value={body.webhook_url_type}
            name="webhook_url_type"
            size="large"
          >
            <Radio value="primary">{t("input.primary")}</Radio>
            <Radio value="secondary">{t("input.secondary")}</Radio>
            <Radio value="both">{t("input.both")}</Radio>
          </Radio.Group>
        </Form.Item>
        {!id && (
          <>
            <Form.Item
              label={t("table.date")}
              style={{ margin: 10 }}
              name="start_date"
              rules={[
                {
                  validator: () => {
                    if (body.delivered_at) {
                      if (
                        body?.end_date &&
                        body?.end_date >
                          moment(new Date(body?.start_date as any))
                            .add(121, "minutes")
                            .format("YYYY-MM-DDTHH:mm:00.000")
                      ) {
                        return Promise.reject(t("error.date_2_hour"));
                      } else return Promise.resolve();
                    }
                    if (
                      body?.end_date &&
                      body?.end_date >
                        moment(new Date(body?.start_date as any))
                          .add(25, "hours")
                          .format("YYYY-MM-DDTHH:mm:00.000")
                    ) {
                      return Promise.reject(t("error.date_1_day"));
                    } else return Promise.resolve();
                  },
                },
              ]}
            >
              <ConfigProvider locale={locale}>
                <RangePicker
                  size="small"
                  format={
                    navigator.language === "pt-BR"
                      ? "DD/MM/YYYY HH:mm"
                      : "YYYY/MM/DD HH:mm"
                  }
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
                  inputReadOnly
                />
              </ConfigProvider>
            </Form.Item>
            <Form.Item label={t("table.profile_id")} style={{ margin: 10 }}>
              <Radio.Group
                onChange={(e) => {
                  setEntity(e.target.value);
                  setBody((state) => ({
                    ...state,
                    merchant_id: undefined,
                    partner_id: undefined,
                  }));
                }}
                value={entity}
                name="webhook_url_type"
                style={{
                  display: "flex",

                  flexWrap: "wrap",
                }}
                size="large"
              >
                <Radio value="partner">{t("table.partner")}</Radio>
                <Radio value="merchant">{t("table.merchant")}</Radio>
              </Radio.Group>
            </Form.Item>
            {permissions?.register?.partner?.partner?.partner_list &&
              entity === "partner" && (
                <Form.Item
                  label={t("table.partner")}
                  style={{ margin: 10 }}
                  rules={[
                    {
                      required: !body.merchant_id && !body.partner_id,
                      message:
                        t("input.required(a)", {
                          field: t("table.partner"),
                        }) || "",
                    },
                  ]}
                  name={"partners_ids"}
                >
                  <PartnerSelect
                    queryOptions={body}
                    setQueryFunction={setBody}
                    
                  />
                </Form.Item>
              )}
            {permissions?.register?.merchant?.merchant?.merchant_list &&
              entity === "merchant" && (
                <Form.Item
                  label={t("table.merchant")}
                  style={{ margin: 10 }}
                  rules={[
                    {
                      required: !body.merchant_id && !body.partners_ids,
                      message:
                        t("input.required(a)", {
                          field: t("table.merchant"),
                        }) || "",
                    },
                  ]}
                  name={"merchant_id"}
                >
                  <MerchantSelect
                    queryOptions={body}
                    setQueryFunction={setBody}
                    
                  />
                </Form.Item>
              )}
          </>
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
