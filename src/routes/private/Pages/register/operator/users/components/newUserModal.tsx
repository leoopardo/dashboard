/* eslint-disable @typescript-eslint/no-explicit-any */
import { GroupSelect } from "@components/Selects/groupSelect";
import { OperatorSelect } from "@src/components/Selects/operatorSelect";
import { Toast } from "@src/components/Toast";
import { queryClient } from "@src/services/queryClient";
import { useCreateOperatorUser } from "@src/services/register/operator/users/createUser";
import { useUpdateOperatorUser } from "@src/services/register/operator/users/updateUser";
import { OperatorItem } from "@src/services/types/register/operators/operators.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Button, Drawer, Form, FormInstance, Input } from "antd";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import ReactInputMask from "react-input-mask";
interface NewuserModalprops {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  currentUser?: OperatorItem | null;
  setCurrentUser?: Dispatch<SetStateAction<NewUserInterface | null>>;
  setUpdateBody?: Dispatch<SetStateAction<NewUserInterface | null>>;
  setIsValidateTokenOpen?: Dispatch<SetStateAction<boolean>>;
  action?: "create" | "update";
}

export interface NewUserInterface {
  name?: string;
  username?: string;
  password?: string;
  email?: string;
  cellphone?: string;
  group_id?: number;
  type?: number;
  status?: boolean;
  operator_id?: number;
  user_id?: number;
}

export const NewUserModal = ({
  open,
  setOpen,
  currentUser,
  setCurrentUser,
  setUpdateBody,
  setIsValidateTokenOpen,
  action,
}: NewuserModalprops) => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const user = queryClient.getQueryData("validate") as ValidateInterface;
  const { t } = useTranslation();
  const submitRef = useRef<HTMLButtonElement>(null);
  const formRef = React.useRef<FormInstance>(null);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [, setCantSubmit] = useState<boolean>(true);
  const [body, setBody] = useState<NewUserInterface>({
    name: "",
    username: "",
    password: "",
    group_id: 0,
    status: true,
    type: 2,
  });

  const { mutate, error, isLoading, isSuccess } = useCreateOperatorUser(body);
  const { updateError, updateLoading, updateSuccess } =
    useUpdateOperatorUser(body);

  function handleChangeUserBody(event: any) {
    setBody((state) => ({ ...state, [event.target.name]: event.target.value }));
  }

  function CreateUser() {
    if (
      currentUser &&
      setUpdateBody &&
      setIsValidateTokenOpen &&
      setCurrentUser && action === "update"
    ) {
      setUpdateBody(body);
      setCurrentUser(null);
      setIsValidateTokenOpen(true);
      setOpen(false);
      return;
    }
    mutate();
    setOpen(false);
  }

  useEffect(() => {
    if (currentUser && action === "update")
      setBody((state) => ({
        ...state,
        name: currentUser?.name,
        group_id: currentUser?.group_id,
        status: currentUser?.status,
        username: currentUser?.username,
        operator_id: currentUser?.operator_id,
      }));
  }, [currentUser]);

  useEffect(() => {
    if (action === "create") {
      setBody({
        name: "",
        username: "",
        password: "",
        group_id: 0,
        status: true,
        type: 2,
      });
    }
  }, [action]);

  return (
    <Drawer
      open={open}
      onClose={() => {
        setOpen(false);
        formRef.current?.resetFields();
        if (setCurrentUser) setCurrentUser(null);
      }}
      bodyStyle={{ overflowX: "hidden" }}
      title={action === "update" ? t("buttons.update_user") : t("buttons.new_user")}
      footer={
        <Button
          loading={action === "update" ? updateLoading : isLoading}
          type="primary"
          style={{ width: "100%" }}
          size="large"
          onClick={() => submitRef.current?.click()}
        >
          {action === "update" ? t("buttons.update") : t("buttons.create")}
        </Button>
      }
    >
      <Form
        ref={formRef}
        layout="vertical"
        initialValues={
          action === "create"
            ? {}
            : currentUser ?? {
                name: "",
                username: "",
                password: "",
                group_id: 0,
                status: true,
                type: 2,
              }
        }
        disabled={action === "update" ? updateLoading : isLoading}
        onFinish={CreateUser}
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
              pattern: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{4}[-\s.]?[0-9]{4,6}$/,
              message:
                t("input.invalid", {
                  field: t("input.number"),
                }) || "",
            },
          ]}
        >
          <ReactInputMask
            value={body.cellphone}
            mask="+9999999999999"
            onChange={(event: any) => {
              const value = event.target.value.replace(/[^\d]/g, "");
              if (!value) {
                delete body.cellphone;
              }
              setBody((state: any) => ({
                ...state,
                cellphone: `+${value}`,
              }));
            }}
          >
            <Input size="large" type="string" name="cellphone" />
          </ReactInputMask>
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
        {permissions.register.operator.operator.operator_list &&
          !user.operator_id && (
            <Form.Item
              label={t("input.operator")}
              name="operator_id"
              style={{ margin: 10 }}
              rules={[
                {
                  required: !body.operator_id,
                  message:
                    t("input.required", {
                      field: t(`input.operator`),
                    }) || "",
                },
              ]}
            >
              <OperatorSelect setQueryFunction={setBody} queryOptions={body} />
            </Form.Item>
          )}

        <Form.Item
          label={t(`table.group`)}
          name="group_id"
          style={{ margin: 10 }}
          rules={[
            {
              required: true,
              message: t("input.required", { field: t("input.group") }) || "",
            },
          ]}
        >
          <GroupSelect
            body={body}
            setBody={setBody}
            filterIdProp="operator_id"
            filterIdValue={
              body?.operator_id || body.operator_id || currentUser?.operator_id
            }
          />
        </Form.Item>
        <Form.Item
          label={t(`table.password`)}
          name="password"
          style={{ margin: 10 }}
          dependencies={["confirmPasswprd"]}
          hasFeedback
          rules={[
            {
              required: action === "create",
              message:
                t("input.required(a)", { field: t("input.password") }) || "",
            },
            { min: 8, message: t("input.min_of", { min: 8 }) || "" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("confirmPasswprd") === value) {
                  setCantSubmit(false);
                  return Promise.resolve();
                }
                setCantSubmit(true);
                return Promise.reject(new Error(t("input.doest_match") || ""));
              },
            }),
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
          dependencies={["password"]}
          style={{ margin: 10 }}
          rules={[
            {
              required: action === "create",
              message: t("input.confirm_password") || "",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  setCantSubmit(false);
                  return Promise.resolve();
                }
                setCantSubmit(true);
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
      <Toast
        actionSuccess={t("messages.created")}
        actionError={t("messages.create")}
        error={error}
        success={isSuccess}
      />
      <Toast
        actionSuccess={t("messages.updated")}
        actionError={t("messages.update")}
        error={updateError}
        success={updateSuccess}
      />
    </Drawer>
  );
};
