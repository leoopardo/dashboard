import { Button, Drawer, Form, FormInstance, Input } from "antd";
import React, {
  Dispatch,
  LegacyRef,
  SetStateAction,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { GroupSelect } from "../../../../../../../components/Selects/groupSelect";
import { useForm } from "antd/es/form/Form";

interface NewuserModalprops {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

interface NewUserInterface {
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
  });

  function handleChangeUserBody(event: any) {
    setBody((state) => ({ ...state, [event.target.name]: event.target.value }));
  }

  return (
    <Drawer
      open={open}
      onClose={() => {
        setOpen(false);
        formRef.current?.resetFields();
      }}
      title={
        t("buttons.new_user").charAt(0).toUpperCase() +
        t("buttons.new_user").slice(1)
      }
      footer={
        <Button
          type="primary"
          style={{ width: "100%" }}
          size="large"
          onClick={() => submitRef.current?.click()}
        >
          {t("buttons.create")}
        </Button>
      }
    >
      <Form ref={formRef} layout="vertical">
        <Form.Item
          label={t(`table.name`)}
          name="name"
          style={{ margin: 10 }}
          rules={[{ required: true, message: "Please input your name!" }]}
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
            { required: true, message: "Please input your username!" },
            { min: 4, message: "Min of 4 characters" },
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
              message: "Invalid number!",
            },
          ]}
        >
          <Input
            size="large"
            type="number"
            name="cellphone"
            value={body.cellphone}
            onChange={handleChangeUserBody}
          />
        </Form.Item>
        <Form.Item
          label={t(`table.email`)}
          name="email"
          style={{ margin: 10 }}
          rules={[{ type: "email", message: "Invalid email!" }]}
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
              message: "Group is missing!",
            },
          ]}
        >
          <Input
            value={body.group_id}
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
            { required: true, message: "Please input your password!" },
            { min: 8, message: "Min of 8 characters" },
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
          rules={[{}]}
        >
          <Input.Password
            type="password"
            size="large"
            name="confirmPasswprd"
            value={confirmPassword}
            // rules={[
            //   {
            //     required: true,
            //     message: "Please confirm your password!",
            //   },
            //   ({ getFieldValue: any }) => ({
            //     validator(_: any, value: string) {
            //       if (!value || getFieldValue("password") === value) {
            //         return Promise.resolve();
            //       }
            //       return Promise.reject(
            //         new Error("The new password that you entered do not match!")
            //       );
            //     },
            //   }),
            // ]}
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
