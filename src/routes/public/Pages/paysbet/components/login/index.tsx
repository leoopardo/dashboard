/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFastPixToken } from "@src/services/FASTPIX/siginIn/signIn";
import { Button, Drawer, Form, Input } from "antd";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface ILoginModal {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const LoginModal = ({ open, setOpen }: ILoginModal) => {
  const { t } = useTranslation();
  const [credentials, setCredentials] = useState<{
    username: string;
    password: string;
  }>();
  const submitRef = useRef<HTMLButtonElement>(null);

  const { Login, isLoading, isSuccess } = useFastPixToken(credentials);
  const handleChangeCredentials = (event: any) => {
    setCredentials((state: any) => ({
      ...state,
      [event.target.name]: event.target.value,
    }));
  };
  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
    }
  }, [isSuccess]);
  
  return (
    <Drawer
      title={t("login.sign_in")}
      placement="right"
      onClose={() => setOpen(false)}
      open={open}
      footer={
        <Button
          loading={isLoading}
          type="primary"
          style={{ width: "100%" }}
          size="large"
          onClick={() => submitRef.current?.click()}
        >
          {t("login.access")}
        </Button>
      }
    >
      <Form layout="vertical" onFinish={Login}>
        <Form.Item label={t("login.user")} name="username">
          <Input
            size="large"
            name="username"
            onChange={handleChangeCredentials}
          />
        </Form.Item>
        <Form.Item label={t("login.password")} name="password">
          <Input.Password
            size="large"
            name="password"
            onChange={handleChangeCredentials}
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
