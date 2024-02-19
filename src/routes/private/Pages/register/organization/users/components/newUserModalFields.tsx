/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GroupSelect } from "@components/Selects/groupSelect";
import { useCreateOrganizationUser } from "@services/register/organization/users/createUser";
import { useUpdateOrganizationUser } from "@services/register/organization/users/updateUser";
import { CellphoneInput } from "@src/components/Inputs/CellphoneInput";
import { Toast } from "@src/components/Toast";
import { useValidate } from "@src/services/siginIn/validate";
import { OrganizationUserItem } from "@src/services/types/register/organization/organizationUsers.interface";
import {
  Form,
  Input,
  Switch,
  Typography
} from "antd";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState
} from "react";
import { useTranslation } from "react-i18next";
interface NewuserModalprops {
  setOpen: Dispatch<SetStateAction<boolean>>;
  currentUser?: OrganizationUserItem | null;
  setCurrentUser?: Dispatch<SetStateAction<NewUserInterface | null>>;
  setUpdateBody?: Dispatch<SetStateAction<NewUserInterface | null>>;
  setIsValidateTokenOpen?: Dispatch<SetStateAction<boolean>>;
  action: "create" | "update";
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
  partner_id?: number;
  merchant_id?: number;
  organization_id?: number;
  user_id?: number;
  validation_token?: string;
}

export const NewUserModalFields = ({
  setOpen,
  currentUser,
  setCurrentUser,
  setUpdateBody,
  setIsValidateTokenOpen,
  action,
  formRef,
  submitRef
}: NewuserModalprops) => {
  const { t } = useTranslation();
  const { responseValidate } = useValidate();
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [, setCantSubmit] = useState<boolean>(true);

  const [body, setBody] = useState<NewUserInterface>({
    name: "",
    username: "",
    group_id: 0,
    status: true,
    type: 2,
    organization_id: responseValidate?.organization_id,
    cellphone: currentUser?.cellphone,
  });

  const { mutate, error, isLoading, isSuccess, reset } =
    useCreateOrganizationUser({
      ...body,
    });
  const { updateLoading } = useUpdateOrganizationUser(body);

  function handleChangeUserBody(event: any) {
    setBody((state) => ({ ...state, [event.target.name]: event.target.value|| null }));
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
    setBody({});
  }

  useEffect(() => {
    setBody((state) => ({
      ...state,
      organization_id: responseValidate?.organization_id,
    }));
  }, [responseValidate]);

  useEffect(() => {
    if (currentUser && action === "update")
      setBody((state) => ({
        ...state,
        name: currentUser?.name,
        group_id: currentUser?.group_id,
        user_id: currentUser?.id,
        status: currentUser?.status,
        username: currentUser?.username,
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
        initialValues={action === "create" ? {} : currentUser ?? body}
        disabled={currentUser ? updateLoading : isLoading}
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
            body={body || currentUser}
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
        <Form.Item
          data-test-id="group"
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
            data-test-id="group-input"
            value={body.group_id || ""}
            style={{ display: "none" }}
            name="group_id"
          />
          <GroupSelect
            body={body}
            setBody={setBody}
            filterIdProp="organization_id"
            filterIdValue={responseValidate?.organization_id}
            notClearble
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
      <Toast
        actionSuccess={t("messages.created")}
        actionError={t("messages.create")}
        error={error}
        success={isSuccess}
      />
    </>
  );
};
