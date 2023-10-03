/* eslint-disable @typescript-eslint/no-explicit-any */
import { Toast } from "@src/components/Toast";
import { useGetSelf } from "@src/services/getSelf";
import { useUpdateSelf } from "@src/services/getSelf/update";
import { UpdateSelf } from "@src/services/types/register/self/self.interface";
import { Button, Drawer, Form, FormInstance, Input } from "antd";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface EditSelfModalInterface {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  self: any;
}

export const EditSelfModal = ({
  open,
  setOpen,
  self,
}: EditSelfModalInterface) => {
  const { t } = useTranslation();
  const { Self, SelfFetching, refetchSelf } = useGetSelf();
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [body, setBody] = useState<UpdateSelf>({});
  const [, setCantSubmit] = useState<boolean>(true);
  const formRef = useRef<FormInstance>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  // const submitRef = useRef<HTMLButtonElement>(null);

  const { error, isLoading, isSuccess, mutate, reset } = useUpdateSelf(body);

  const handleChangeUserBody = (event: any) => {
    setBody((state) => ({ ...state, [event.target.name]: event.target.value }));
  };

  useEffect(() => {
    setBody({ cellphone: Self?.cellphone, email: Self?.email });
  }, [Self]);

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
      reset();
      refetchSelf();
    }
  }, [isSuccess]);

  return (
    <Drawer
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      title={self?.name}
      footer={
        <Button
          loading={isLoading}
          type="primary"
          style={{ width: "100%" }}
          size="large"
          onClick={() => submitRef.current?.click()}
        >
          {t("buttons.update")}
        </Button>
      }
    >
      {!SelfFetching && (
        <Form
          ref={formRef}
          layout="vertical"
          initialValues={{ ...Self }}
          onFinish={() => {
            if (Self?.cellphone !== body?.cellphone) {
              return;
            }
            mutate();
          }}
        >
          <Form.Item label={t("table.email")} name="email">
            <Input
              size="large"
              name="email"
              value={body?.email}
              onChange={handleChangeUserBody}
            />
          </Form.Item>
          <Form.Item label={t("table.cellphone")}>
            <Input
              size="large"
              name="cellphone"
              value={body?.cellphone}
              onChange={handleChangeUserBody}
            />
          </Form.Item>
          <Form.Item
            label={t(`table.password`)}
            name="password"
            dependencies={["confirm"]}
            hasFeedback={body.password !== undefined}
            rules={[
              { min: 8, message: t("input.min_of", { min: 8 }) || "" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("confirm") === value) {
                    setCantSubmit(false);
                    return Promise.resolve();
                  }
                  setCantSubmit(true);
                  return Promise.reject(
                    new Error(t("input.doest_match") || "")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              type="password"
              size="large"
              name="password"
              autoComplete="new-password"
              value={body.password}
              onChange={handleChangeUserBody}
            />
          </Form.Item>
          <Form.Item
            label={t(`table.password`)}
            name="confirm"
            dependencies={["password"]}
            hasFeedback={body.password !== undefined}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    setCantSubmit(false);
                    return Promise.resolve();
                  }
                  setCantSubmit(true);
                  return Promise.reject(
                    new Error(t("input.doest_match") || "")
                  );
                },
              }),
            ]}
            
          >
            <Input.Password
              type="password"
              size="large"
              name="confirm"
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
      )}

      <Toast
        actionError={t("messages.update")}
        actionSuccess={t("messages.updated")}
        error={error}
        success={isSuccess}
      />
    </Drawer>
  );
};
