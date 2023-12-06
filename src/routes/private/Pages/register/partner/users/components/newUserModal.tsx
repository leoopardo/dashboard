/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GroupSelect } from "@components/Selects/groupSelect";
import { CellphoneInput } from "@src/components/Inputs/CellphoneInput";
import { PartnerSelect } from "@src/components/Selects/partnerSelect";
import { Toast } from "@src/components/Toast";
import { queryClient } from "@src/services/queryClient";
import { useCreatePartnerUser } from "@src/services/register/partner/users/createUser";
import { useUpdatePartnerUser } from "@src/services/register/partner/users/updateUser";
import { OrganizationUserItem } from "@src/services/types/register/organization/organizationUsers.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import {
  Button,
  Drawer,
  Form,
  FormInstance,
  Input,
  Switch,
  Typography,
} from "antd";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
interface NewuserModalprops {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  currentUser?: OrganizationUserItem | null;
  setCurrentUser?: Dispatch<SetStateAction<NewUserInterface | null>>;
  setUpdateBody?: Dispatch<SetStateAction<NewUserInterface | null>>;
  setIsValidateTokenOpen?: Dispatch<SetStateAction<boolean>>;
  action?: "create" | "update";
}

export interface NewUserInterface {
  name: string;
  username: string;
  password?: string;
  email?: string;
  cellphone?: string;
  group_id: number;
  type?: number;
  status: boolean;
  partner_id?: number;
  merchant_id?: number;
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
  const user = queryClient.getQueryData("validate") as ValidateInterface;

  const { t } = useTranslation();
  const submitRef = useRef<HTMLButtonElement>(null);
  const formRef = React.useRef<FormInstance>(null);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [, setCantSubmit] = useState<boolean>(true);
  const [body, setBody] = useState<NewUserInterface>({
    name: "",
    username: "",
    group_id: 0,
    status: true,
    type: 2,
    cellphone: currentUser?.cellphone,
  });

  const { mutate, error, isLoading, isSuccess, reset } =
    useCreatePartnerUser(body);
  const { updateLoading } = useUpdatePartnerUser({
    ...body,
    partner_id: body?.partner_id || currentUser?.partner_id || user.partner_id,
  });

  function handleChangeUserBody(event: any) {
    setBody((state) => ({ ...state, [event.target.name]: event.target.value || null }));
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
    mutate();
  }

  useEffect(() => {
    if (currentUser && action === "update")
      setBody((state) => ({
        ...state,
        name: currentUser.name,
        group_id: currentUser.group_id,
        user_id: currentUser.id,
        status: currentUser.status,
        username: currentUser.username,
        partner_id: currentUser.partner_id,
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
      setBody({
        name: "",
        username: "",
        partner_id: user.partner_id,
        group_id: 0,
        status: true,
        type: 2,
        cellphone: "",
      });
      formRef.current?.resetFields();
    }
  }, [error]);

  return (
    <Drawer
      open={open}
      onClose={() => {
        setOpen(false);
        formRef.current?.resetFields();
        if (setCurrentUser) setCurrentUser(null);
      }}
      bodyStyle={{ overflowX: "hidden" }}
      title={
        action === "update" ? t("buttons.update_user") : t("buttons.new_user")
      }
      footer={
        <Button
          data-test-id="submit-button"
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

        {user.permissions.register.partner.partner.partner_list && (
          <Form.Item
            data-test-id="partner"
            label={t(`table.partner`)}
            name="partner_id"
            style={{ margin: 10 }}
            rules={[
              {
                required:
                  !body.partner_id && action === "create" ? true : false,
                message:
                  t("input.required", { field: t("input.partner") }) || "",
              },
            ]}
          >
            <PartnerSelect
              queryOptions={body ?? currentUser}
              setQueryFunction={setBody}
            />
          </Form.Item>
        )}

        <Form.Item
          data-test-id="group"
          label={t(`table.group`)}
          name="group_id"
          style={{ margin: 10 }}
          rules={[
            {
              required: !body.group_id && action === "create" ? true : false,
              message: t("input.required", { field: t("input.group") }) || "",
            },
          ]}
        >
          <Input
            value={body.group_id || ""}
            style={{ display: "none" }}
            name="group_id"
          />
          <GroupSelect
            body={body}
            setBody={setBody}
            filterIdProp="partner_id"
            filterIdValue={
              user?.partner_id ?? body?.partner_id ?? currentUser?.partner.id
            }
          />
        </Form.Item>

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
              disabled={action === "create"}
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
      <Toast
        actionSuccess={t("messages.created")}
        actionError={t("messages.create")}
        error={error}
        success={isSuccess}
      />
    </Drawer>
  );
};
