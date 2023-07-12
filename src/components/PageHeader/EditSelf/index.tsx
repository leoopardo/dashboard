/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetSelf } from "@src/services/getSelf";
import { Drawer, Form, FormInstance, Input } from "antd";
import { Dispatch, SetStateAction, useRef } from "react";
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
  const { Self } = useGetSelf();
  const formRef = useRef<FormInstance>(null);
  // const submitRef = useRef<HTMLButtonElement>(null);
  return (
    <Drawer
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      title={self?.name}
    >
      <Form
        ref={formRef}
        layout="vertical"
        initialValues={{ ...Self }}
        onFinish={() => {
          setOpen(false);
        }}
      >
        <Form.Item label={t("table.email")} name="email">
          <Input size="large" />
        </Form.Item>
        <Form.Item label={t("table.cellphone")} name="cellphone">
          <Input size="large" />
        </Form.Item>
      </Form>
    </Drawer>
  );
};
