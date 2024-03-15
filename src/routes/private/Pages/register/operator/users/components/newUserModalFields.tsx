/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GroupSelect } from "@components/Selects/groupSelect";
import { CellphoneInput } from "@src/components/Inputs/CellphoneInput";
import { OperatorSelect } from "@src/components/Selects/operatorSelect";
import { queryClient } from "@src/services/queryClient";
import { useCreateOperatorUser } from "@src/services/register/operator/users/createUser";
import { useUpdateOperatorUser } from "@src/services/register/operator/users/updateUser";
import { OperatorItem } from "@src/services/types/register/operators/operators.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Form, Input, Switch, Typography } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
interface NewuserModalprops {
  setOpen: Dispatch<SetStateAction<boolean>>;
  currentUser?: OperatorItem | null;
  setCurrentUser?: Dispatch<SetStateAction<NewUserInterface | null>>;
  setUpdateBody?: Dispatch<SetStateAction<NewUserInterface | null>>;
  setIsValidateTokenOpen?: Dispatch<SetStateAction<boolean>>;
  action?: "create" | "update";
  fuctionMutate: () => void;
  body: NewUserInterface;
  setBody: Dispatch<SetStateAction<NewUserInterface>>;
  formRef?: any;
  submitRef?: any;
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

export const NewUserModalFields = ({
  setOpen,
  currentUser,
  setCurrentUser,
  setUpdateBody,
  setIsValidateTokenOpen,
  action,
  body,
  setBody,
  fuctionMutate,
  formRef,
  submitRef,
}: NewuserModalprops) => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const user = queryClient.getQueryData("validate") as ValidateInterface;
  const { t } = useTranslation();
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [, setCantSubmit] = useState<boolean>(true);

  const { updateLoading } = useUpdateOperatorUser(body);

  const { isLoading, isSuccess, error, reset } = useCreateOperatorUser(body);

  function handleChangeUserBody(event: any) {
    setBody((state) => ({
      ...state,
      [event.target.name]: event.target.value || null,
    }));
  }

  function CreateUser() {
    if (
      currentUser &&
      setUpdateBody &&
      setIsValidateTokenOpen &&
      setCurrentUser &&
      action === "update"
    ) {
      setUpdateBody(body);
      setCurrentUser(null);
      setIsValidateTokenOpen(true);
      setOpen(false);
      return;
    }
    fuctionMutate();
    setOpen(false);
  }

  useEffect(() => {
    if (currentUser && action === "update")
      setBody((state) => ({
        ...state,
        user_id: currentUser?.id,
        name: currentUser?.name,
        group_id: currentUser?.group_id,
        status: currentUser?.status,
        username: currentUser?.username,
        operator_id: currentUser?.operator_id,
        cellphone: currentUser?.cellphone,
        email: currentUser?.email,
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

  useEffect(() => {
    if (isSuccess) {
      reset();
      setOpen(false);
      formRef.current?.resetFields();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      setBody({});
      formRef.current?.resetFields();
    }
  }, [error]);

  return (
    <>
      <Form
        data-test-id="form"
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
          data-test-id="name"
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
            data-test-id="name-input"
            size="large"
            name="name"
            value={body.name}
            onChange={handleChangeUserBody}
          />
        </Form.Item>
        {action === "create" && (
          <Form.Item
            data-test-id="username"
            label={t(`table.username`)}
            name="username"
            style={{ margin: 10 }}
            rules={[
              {
                required: action === "create",
                message:
                  t("input.required", { field: t("input.username") }) || "",
              },
              { min: 4, message: t("input.min_of", { min: 4 }) || "" },
            ]}
          >
            <Input
              data-test-id="username-input"
              size="large"
              name="username"
              autoComplete="new-password"
              value={body.username}
              onChange={handleChangeUserBody}
            />
          </Form.Item>
        )}
        <Form.Item
          data-test-id="cellphone"
          label={t(`table.cellphone`)}
          name="cellphone"
          style={{ margin: 10 }}
        >
          <CellphoneInput
            data-test-id="cellphone-input"
            body={body}
            setBody={setBody}
          />
        </Form.Item>
        <Form.Item
          data-test-id="email"
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
            data-test-id="email-input"
            size="large"
            name="email"
            autoComplete="new-password"
            value={body.cellphone}
            onChange={handleChangeUserBody}
          />
        </Form.Item>
        {permissions.register.operator.operator.operator_list &&
          action === "create" &&
          !user.operator_id && (
            <Form.Item
              data-test-id="operator"
              label={t("input.operator")}
              name="operator_id"
              style={{ margin: 10 }}
              rules={[
                {
                  required: !body.operator_id && action === "create",
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
          data-test-id="group"
          label={t(`table.group`)}
          name="group_id"
          style={{ margin: 10 }}
          rules={[
            {
              required: !body.group_id && action === "create",
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

        {action === "update" && (
          <Form.Item
            data-test-id="status"
            label={t("table.status")}
            name="status"
            style={{ margin: 10 }}
          >
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Typography style={{ marginRight: 8 }}>
                {t("table.inactive")}
              </Typography>
              <Switch
                data-test-id="status-switch"
                checked={body?.status}
                onChange={(checked) =>
                  setBody((state) => ({ ...state, status: checked }))
                }
              />{" "}
              <Typography style={{ marginLeft: 8 }}>
                {t("table.active")}
              </Typography>
            </div>
          </Form.Item>
        )}

        <Form.Item
          data-test-id="password"
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
            {
              pattern:
                /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]*$/,
              message: `${t("input.password_type")}`,
            },
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
            data-test-id="password-input"
            type="password"
            size="large"
            name="password"
            autoComplete="new-password"
            value={body.username}
            onChange={handleChangeUserBody}
          />
        </Form.Item>
        <Form.Item
          data-test-id="confirm-password"
          label={t(`table.confirm_password`)}
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
            data-test-id="confirm-password-input"
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
    </>
  );
};
