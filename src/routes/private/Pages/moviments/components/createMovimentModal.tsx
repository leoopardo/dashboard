/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MerchantCategorieSelect } from "@src/components/Selects/merchantCategorieSelect";
import { MerchantSelect } from "@src/components/Selects/merchantSelect";
import { OrganizationCategorieSelect } from "@src/components/Selects/organizationCategorieSelect";
import { Button, Drawer, Form, FormInstance, Input } from "antd";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { NumericFormat } from "react-number-format";

interface CreateMovimentModalInterface {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onSubmit: () => void;
  type: "in" | "out";
  body: any;
  setBody: Dispatch<SetStateAction<any>>;
  category: "merchant" | "organization";
}

export const CreateMovimentModal = ({
  open,
  setOpen,
  onSubmit,
  type,
  body,
  setBody,
  category,
}: CreateMovimentModalInterface) => {
  const { t } = useTranslation();
  const submitRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<FormInstance>(null);

  const onChange = (event: any) => {
    const { value } = event.target;
    setBody((state: any) => ({ ...state, [event.target.name]: value }));
  };

  useEffect(() => {
    setBody({
      type,
      category_id: undefined,
      value: undefined,
      description: undefined,
    });
  }, [type, open]);

  return (
    <Drawer
      open={open}
      onClose={() => {
        setOpen(false);
        formRef.current?.resetFields();
      }}
      title={t(`modal.register_${type}`)}
      bodyStyle={{ overflowX: "hidden" }}
      footer={
        <Button
          // loading={submitLoading}
          type="primary"
          style={{ width: "100%" }}
          size="large"
          onClick={() => submitRef.current?.click()}
        >
          {t(`modal.register_${type}`)}
        </Button>
      }
    >
      <Form
        ref={formRef}
        layout="vertical"
        // disabled={submitLoading}
        onFinish={() => {
          onSubmit();
          setOpen(false);
        }}
      >
        {category === "merchant" && (
          <Form.Item
            label={t("table.merchant")}
            name="category"
            style={{ margin: 10 }}
            rules={[
              {
                required: !body?.merchant_id,
                message:
                  t("input.required", {
                    field: t("table.merchant"),
                  }) || "",
              },
            ]}
          >
            <MerchantSelect queryOptions={body} setQueryFunction={setBody} />
          </Form.Item>
        )}

        <Form.Item
          label={t("table.category")}
          name="category"
          style={{ margin: 10 }}
          rules={[
            {
              required: !body?.category_id,
              message:
                t("input.required", {
                  field: t("table.category"),
                }) || "",
            },
          ]}
        >
          {category === "organization" ? (
            <OrganizationCategorieSelect
              setQueryFunction={setBody}
              queryOptions={body}
            />
          ) : (
            <MerchantCategorieSelect
              setQueryFunction={setBody}
              queryOptions={body}
            />
          )}
        </Form.Item>

        <Form.Item
          label={t("table.value")}
          name="value"
          style={{ margin: 10 }}
          rules={[
            {
              required: true,
              message:
                t("input.required", {
                  field: t("table.value"),
                }) || "",
            },
          ]}
        >
          <NumericFormat
            style={{ width: "100%" }}
            customInput={Input}
            size="large"
            decimalScale={2}
            thousandSeparator="."
            decimalSeparator=","
            fixedDecimalScale
            value={body?.value}
            placeholder="R$ 0,00"
            allowLeadingZeros
            onValueChange={(values: any) => {
              const { value } = values;
              setBody((state: any) => ({
                ...state,
                value: Number(value),
              }));
            }}
            prefix="R$ "
          />
        </Form.Item>
        <Form.Item
          label={t("table.description")}
          name="description"
          style={{ margin: 10 }}
        >
          <Input.TextArea
            size="large"
            name="description"
            value={body?.description}
            onChange={onChange}
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <button type="submit" ref={submitRef} style={{ display: "none" }}>
            Submit
          </button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};
