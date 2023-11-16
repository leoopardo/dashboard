/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CellphoneInput } from "@src/components/Inputs/CellphoneInput";
import { Toast } from "@src/components/Toast";
import { ValidateToken } from "@src/components/ValidateToken";
import { useGetSelf } from "@src/services/getSelf";
import { useUpdateSelf } from "@src/services/getSelf/update";
import { queryClient } from "@src/services/queryClient";
import {
  SelfInterface,
  UpdateSelf,
} from "@src/services/types/register/self/self.interface";
import { Button, Drawer, Form, FormInstance, Input, Spin } from "antd";
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
  const selfData: SelfInterface | undefined = queryClient.getQueryData("Self");
  const { Self, SelfFetching, refetchSelf } = useGetSelf();
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [body, setBody] = useState<UpdateSelf>({ ...selfData });
  const [, setCantSubmit] = useState<boolean>(true);
  const formRef = useRef<FormInstance>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const [isValidateTokenOpen, setIsValidateTokenOpen] =
    useState<boolean>(false);
  const [tokenState, setTokenState] = useState<string>("");
  // const submitRef = useRef<HTMLButtonElement>(null);

  const { error, isLoading, isSuccess, mutate, reset } = useUpdateSelf({
    ...body,
    cellphone: Self?.cellphone !== body.cellphone ? body.cellphone : undefined,
    validation_token: tokenState,
  });

  const handleChangeUserBody = (event: any) => {
    setBody((state) => ({ ...state, [event.target.name]: event.target.value }));
  };

  useEffect(() => {
    setBody({ cellphone: Self?.cellphone, email: Self?.email });
  }, [Self, open]);

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
      reset();
      refetchSelf();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (open === true) {
      refetchSelf();
    }
  }, [open]);

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
      {!body && SelfFetching ? (
        <Spin size="large"/>
      ) : (
        <Form
          ref={formRef}
          layout="vertical"
          initialValues={Self ?? body}
          onFinish={() => {
            if (Self?.cellphone !== body?.cellphone) {
              setIsValidateTokenOpen(true);
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
          <Form.Item label={t(`table.cellphone`)} name="cellphone">
            <CellphoneInput body={body} setBody={setBody} />
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

      {isValidateTokenOpen && (
        <ValidateToken
          open={isValidateTokenOpen}
          setIsOpen={setIsValidateTokenOpen}
          setTokenState={setTokenState}
          tokenState={tokenState}
          action="USER_UPDATE_SELF_PHONE"
          body={body}
          error={error}
          success={isSuccess}
          submit={mutate}
          editSelf
        />
      )}
    </Drawer>
  );
};
