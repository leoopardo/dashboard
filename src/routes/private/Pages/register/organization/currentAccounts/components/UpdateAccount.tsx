/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

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

interface UpdateAccountProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  currenItem?: any | null;
  setCurrentItem?: Dispatch<
    SetStateAction<{ id: string; name: string; locked: boolean } | null>
  >;
  setUpdateBody: Dispatch<
    SetStateAction<{ id?: string; name?: string; locked?: boolean }>
  >;
  submit: () => void;
  loading: boolean;
}
export const UpdateUserModal = ({
  open,
  setOpen,
  currenItem,
  setCurrentItem,
  loading,
  setUpdateBody,
  submit,
}: UpdateAccountProps) => {
  const { t } = useTranslation();
  const submitRef = useRef<HTMLButtonElement>(null);
  const formRef = React.useRef<FormInstance>(null);
  const [locked, setLocked] = useState<boolean>(currenItem?.locked);

  function handleChangeUserBody(event: any) {
    setUpdateBody((state) => ({
      ...state,
      [event.target.name]: event.target.value || null,
    }));
  }

  useEffect(() => {
    if (currenItem) formRef.current?.setFieldsValue(currenItem);
  }, [currenItem]);

  return (
    <Drawer
      open={open}
      onClose={() => {
        setOpen(false);
        formRef.current?.resetFields();
        if (setCurrentItem) setCurrentItem(null);
      }}
      bodyStyle={{ overflowX: "hidden" }}
      title={t("buttons.update_user")}
      footer={
        <Button
          data-test-id="submit-button"
          loading={loading}
          type="primary"
          style={{ width: "100%" }}
          size="large"
          onClick={() => submitRef.current?.click()}
        >
          {t("buttons.update")}
        </Button>
      }
    >
      <Form
        data-test-id="form"
        ref={formRef}
        layout="vertical"
        initialValues={currenItem || {}}
        disabled={loading}
        onFinish={submit}
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
            onChange={handleChangeUserBody}
          />
        </Form.Item>

        <Form.Item
          data-test-id="locked"
          label={t("table.locked")}
          name="locked"
          style={{ margin: 10 }}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Typography style={{ marginRight: 8 }}>
              {t("table.false")}
            </Typography>
            <Switch
              data-test-id="locked-switch"
              checked={locked}
              onChange={(checked) => {
                setLocked(checked);
                setUpdateBody((state) => ({ ...state, locked: checked }));
              }}
            />{" "}
            <Typography style={{ marginLeft: 8 }}>{t("table.true")}</Typography>
          </div>
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
