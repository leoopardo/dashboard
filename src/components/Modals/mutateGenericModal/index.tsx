import { Button, Drawer, Form, FormInstance, Input } from "antd";
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
    console.log(event.target.name);

    setBody((state: any) => ({
      ...state,
      [event.target.name]: event.target.value,
    }));
  };

  useEffect(() => {
    setBody({});
  }, []);

  return (
    <Drawer
      open={open}
      onClose={() => {
        setOpen(false);
        formRef.current?.resetFields();
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
          {t("buttons.create")}
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
          if (success) {
            setOpen(false);
            toast.success(
              t("messages.action_success", { type: t(`messages.${type}d`) })
            );
          }
          if (error) {
            toast.error(
              t("messages.action_error", { type: t(`messages.${type}`) })
            );
          }
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
