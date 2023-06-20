import { Button, Drawer, Form, FormInstance, Input } from "antd";
import React, {
  Dispatch,
  SetStateAction,
  useRef,
  useState,
  useEffect,
} from "react";
import { useTranslation } from "react-i18next";
import { GroupSelect } from "@components/Selects/groupSelect";
import { useCreateOrganizationUser } from "@services/register/organization/users/createUset";
import { toast } from "react-hot-toast";

interface NewuserModalprops {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export interface NewUserInterface {
  name: string;
  username: string;
  password: string;
  email?: string;
  cellphone?: string;
  group_id: number;
  type?: number;
  status: true;
  partner_id?: number;
  merchant_id?: number;
}

export const NewUserModal = ({ open, setOpen }: NewuserModalprops) => {
  const { t } = useTranslation();
  const submitRef = useRef<HTMLButtonElement>(null);
  const formRef = React.useRef<FormInstance>(null);
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [body, setBody] = useState<NewUserInterface>({
    name: "",
    username: "",
    password: "",
    group_id: 0,
    status: true,
    type: 2,
  });

  const { mutate, error, isLoading, isSuccess } =
    useCreateOrganizationUser(body);

  function handleChangeUserBody(event: any) {
    setBody((state) => ({ ...state, [event.target.name]: event.target.value }));
  }

  function CreateUser(event: any) {
    event.preventDefault();
    mutate();
  }

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
      toast.success("Usuário criado com sucesso!");
    }
    if (error) {
      toast.error("Erro ao criar usuário, tente novamente!");
    }
  }, [isSuccess, error]);

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
          loading={isLoading}
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
        disabled={isLoading}
        onSubmitCapture={
          body.name && body.username && body.group_id && body.password
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
          label={t(`table.username`)}
          name="username"
          style={{ margin: 10 }}
          rules={[
            {
              required: true,
              message:
                t("input.required", { field: t("input.username") }) || "",
            },
            { min: 4, message: t("input.min_of", { min: 4 }) || "" },
          ]}
        >
          <Input
            size="large"
            name="username"
            value={body.username}
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
          label={t(`table.email`)}
          name="email"
          style={{ margin: 10 }}
          rules={[
            {
              type: "email",
              message:
                t("input.invalid", {
                  field: t("input.email"),
                }) || "",
            },
          ]}
        >
          <Input
            size="large"
            name="email"
            value={body.cellphone}
            onChange={handleChangeUserBody}
          />
        </Form.Item>
        <Form.Item
          label={t(`table.group`)}
          name="group_id"
          style={{ margin: 10 }}
          rules={[
            {
              required: !body.group_id ? true : false,
              message: t("input.required", { field: t("input.group") }) || "",
            },
          ]}
        >
          <Input
            value={body.group_id || ""}
            style={{ display: "none" }}
            name="group_id"
          />
          <GroupSelect body={body} setBody={setBody} />
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
            value={body.username}
            onChange={handleChangeUserBody}
          />
        </Form.Item>
        <Form.Item
          label={t(`table.password`)}
          name="confirmPasswprd"
          style={{ margin: 10 }}
          rules={[
            {
              required: true,
              message: t("input.confirm_password") || "",
            },
            ({ getFieldValue: any }) => ({
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
            name="confirmPasswprd"
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
    </Drawer>
  );
};
