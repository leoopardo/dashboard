import { Button, Drawer, Form, FormInstance, Input, Switch } from "antd";
import React, { Dispatch, SetStateAction, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MerchantSelect } from "../../Selects/merchantSelect";
import { PartnerSelect } from "../../Selects/partnerSelect";
import { toast } from "react-hot-toast";

interface mutateProps {
  type: "create" | "update";
  fields: { label: string; required: boolean }[];
  modalName: string;
  setBody: Dispatch<SetStateAction<any>>;
  body: any;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  submit: () => void;
  submitLoading: boolean;
  success: boolean;
  error: any;
}

export const MutateModal = ({
  type,
  body,
  fields,
  open,
  setBody,
  setOpen,
  submit,
  modalName,
  submitLoading,
  success,
  error,
}: mutateProps) => {
  const { t } = useTranslation();
  const formRef = useRef<FormInstance>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  const handleChange = (event: any) => {
    setBody((state: any) => ({
      ...state,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <Drawer
      open={open}
      onClose={() => {
        setOpen(false);
        formRef.current?.resetFields();
        if (type === "create") setBody({});
      }}
      bodyStyle={{ overflowX: "hidden" }}
      title={modalName}
      footer={
        <Button
          loading={submitLoading}
          type="primary"
          style={{ width: "100%" }}
          size="large"
          onClick={() => submitRef.current?.click()}
        >
          {type == "create" ? t("buttons.create") : t("buttons.update")}
        </Button>
      }
    >
      <Form
        ref={formRef}
        layout="vertical"
        initialValues={body}
        disabled={submitLoading}
        onSubmitCapture={() => {
          submit();
          setOpen(false);
        }}
      >
        {fields.map((field) => {
          switch (field.label) {
            case "merchant":
              <Form.Item
                label={t(`table.${field.label}`)}
                name={field.label}
                style={{ margin: 10 }}
                rules={[
                  {
                    required: field.required,
                    message:
                      t("input.required", {
                        field: t(`input.${field.label}`),
                      }) || "",
                  },
                ]}
              >
                <MerchantSelect
                  setQueryFunction={setBody}
                  queryOptions={body}
                />
              </Form.Item>;
              return;

            case "partner":
              <Form.Item
                label={t(`table.${field.label}`)}
                name={field.label}
                style={{ margin: 10 }}
                rules={[
                  {
                    required: field.required,
                    message:
                      t("input.required", {
                        field: t(`input.${field.label}`),
                      }) || "",
                  },
                ]}
              >
                <PartnerSelect setQueryFunction={setBody} queryOptions={body} />
              </Form.Item>;
              return;
            case "status":
            case "cash_in":
            case "cash_out":
              return (
                <Form.Item
                  label={t(`table.${field.label}`)}
                  name={field.label}
                  style={{ margin: 10 }}
                  valuePropName="checked"
                >
                  <Switch
                    checked={body[field.label]}
                    onChange={(e) =>
                      setBody((state: any) => ({ ...state, [field.label]: e }))
                    }
                  />
                </Form.Item>
              );
              return;

            default:
              return (
                <Form.Item
                  label={t(`table.${field.label}`)}
                  name={field.label}
                  style={{ margin: 10 }}
                  rules={[
                    {
                      required: field.required,
                      message:
                        t("input.required", {
                          field: t(`input.${field.label}`),
                        }) || "",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    name={field.label}
                    value={body[field.label]}
                    onChange={handleChange}
                  />
                </Form.Item>
              );
          }
        })}
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <button type="submit" ref={submitRef} style={{ display: "none" }}>
            Submit
          </button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};
