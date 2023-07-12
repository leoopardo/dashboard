/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PartnerSelect } from "@components/Selects/partnerSelect";
import { Toast } from "@components/Toast";
import { useCreateMerchant } from "@services/register/merchant/merchant/createMerchant";
import { queryClient } from "@src/services/queryClient";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Button, Drawer, Form, FormInstance, Input } from "antd";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface NewuserModalprops {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export interface NewUserInterface {
  name: string;
  domain: string;
  password: string;
  email?: string;
  cellphone?: string;
  cnpj?: string;
  type?: number;
  status: true;
  partner_id?: number;
  merchant_id?: number;
}

export const NewMerchantModal = ({ open, setOpen }: NewuserModalprops) => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const { t } = useTranslation();
  const submitRef = useRef<HTMLButtonElement>(null);
  const formRef = React.useRef<FormInstance>(null);
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [body, setBody] = useState<NewUserInterface>({
    name: "",
    domain: "",
    password: "",
    status: true,
    type: 2,
  });

  const { CreateError, CreateIsLoading, CreateIsSuccess, CreateMutate } =
    useCreateMerchant(body);

  function handleChangeUserBody(event: any) {
    setBody((state) => ({ ...state, [event.target.name]: event.target.value }));
  }

  function CreateUser(event: any) {
    event.preventDefault();
    CreateMutate();
  }
  return (
    <Drawer
      open={open}
      onClose={() => {
        setOpen(false);
        formRef.current?.resetFields();
      }}
      bodyStyle={{ overflowX: "hidden" }}
      title={
        t("buttons.new_user").charAt(0).toUpperCase() +
        t("buttons.new_user").slice(1)
      }
      footer={
        <Button
          loading={CreateIsLoading}
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
        disabled={CreateIsLoading}
        onSubmitCapture={
          body.name && body.domain && body.password
            ? CreateUser
            : () => {
                return;
              }
        }
      >
        <Form.Item
          label={t(`table.name`)}
          name="name"
          style={{ margin: 10 }}
          rules={[
            {
              required: true,
              message: t("input.required", { field: t("input.name") }) || "",
            },
          ]}
        >
          <Input
            size="large"
            name="name"
            value={body.name}
            onChange={handleChangeUserBody}
          />
        </Form.Item>
        <Form.Item
          label={t(`table.domain`)}
          name="username"
          style={{ margin: 10 }}
          rules={[
            {
              required: true,
              message: t("input.required", { field: t("input.domain") }) || "",
            },
            { min: 4, message: t("input.min_of", { min: 4 }) || "" },
          ]}
        >
          <Input
            size="large"
            name="domain"
            value={body.domain}
            onChange={handleChangeUserBody}
          />
        </Form.Item>

        {permissions.register.partner.partner.partner_list && (
          <Form.Item
            label={t(`table.partner`)}
            name="partner_id"
            style={{ margin: 10 }}
            rules={[
              {
                required: !body.partner_id ? true : false,
                message:
                  t("input.required", { field: t("input.partner_id") }) || "",
              },
            ]}
          >
            <Input
              value={body.partner_id || ""}
              style={{ display: "none" }}
              name="partner_id"
            />
            <PartnerSelect queryOptions={body} setQueryFunction={setBody} />
          </Form.Item>
        )}

        <Form.Item
          label={t(`table.cnpj`)}
          name="cnpj"
          style={{ margin: 10 }}
          rules={[
            {
              pattern: /^(\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2})$/,
              message:
                t("input.invalid", {
                  field: t("input.number"),
                }) || "",
            },
          ]}
        >
          <Input
            size="large"
            type="string"
            name="cnpj"
            value={body.cnpj}
            onChange={handleChangeUserBody}
          />
        </Form.Item>

        <Form.Item
          label={t(`table.cellphone`)}
          name="cellphone"
          style={{ margin: 10 }}
          rules={[
            {
              pattern: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
              message:
                t("input.invalid", {
                  field: t("input.number"),
                }) || "",
            },
          ]}
        >
          <Input
            size="large"
            type="string"
            name="cellphone"
            value={body.cellphone}
            onChange={handleChangeUserBody}
          />
        </Form.Item>

        <Form.Item
          label={t(`table.password`)}
          name="password"
          style={{ margin: 10 }}
          hasFeedback
          rules={[
            {
              required: true,
              message:
                t("input.required(a)", { field: t("input.password") }) || "",
            },
            { min: 8, message: t("input.min_of", { min: 8 }) || "" },
          ]}
        >
          <Input.Password
            type="password"
            size="large"
            name="password"
            value={body.password}
            onChange={handleChangeUserBody}
          />
        </Form.Item>
        <Form.Item
          label={t(`table.confirm_password`)}
          name="confirmPassword"
          style={{ margin: 10 }}
          rules={[
            {
              required: true,
              message: t("input.confirm_password") || "",
            },
            () => ({
              validator(_: any, value: string) {
                if (!value || body.password === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t("input.doest_match") || ""));
              },
            }),
          ]}
          hasFeedback
        >
          <Input.Password
            type="password"
            size="large"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <button type="submit" ref={submitRef} style={{ display: "none" }}>
            Submit
          </button>
        </Form.Item>
      </Form>

      <Toast
        actionSuccess={t("messages.created")}
        actionError={t("messages.create")}
        error={CreateError}
        success={CreateIsSuccess}
      />
    </Drawer>
  );
};
