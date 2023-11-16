/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Grid } from "@mui/material";
import { Button, Modal, Typography, message } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import OTPInput from "react-otp-input";
import { useGetSelf } from "../../services/getSelf";
import { useValidatePhone } from "../../services/sendValidationPhone";
import { useValidateToken } from "../../services/sendValidationToken";
import Countdown from "../countdown";

interface ValidateTokenProps {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  body?: any;
  action: string;
  tokenState: string;
  setTokenState: Dispatch<SetStateAction<string>>;
  success: boolean;
  error: any;
  submit: () => void;
  editSelf?: boolean;
}

export const ValidateToken = ({
  open,
  setIsOpen,
  action,
  tokenState,
  setTokenState,
  body,
  submit,
  success,
  error,
  editSelf,
}: ValidateTokenProps) => {
  const { t } = useTranslation();
  const { Self, refetchSelf } = useGetSelf();
  const [validationTokenSent, setValidationTokenSent] =
    useState<boolean>(false);
  const [validationPhoneSent, setValidationPhoneSent] =
    useState<boolean>(false);
  const [validateBody, setValidateBody] = useState<{
    action: string;
    cellphone?: string | undefined;
  }>({ action, cellphone: undefined });
  const {
    ValidateToken,
    ValidateTokenLoading,
    ValidateTokenSuccess,
    tokenData,
  } = useValidateToken(
    validateBody,
    validationTokenSent || validationPhoneSent
  );
  const {
    ValidatePhone,
    ValidatePhoneLoading,
    ValidatePhoneError,
    ValidatePhoneSuccess,
  } = useValidatePhone({ validation_token: tokenState });

  const [ableToResend] = useState<boolean>(true);

  useEffect(() => {
    refetchSelf();
    setValidationPhoneSent(false);
    setValidationTokenSent(false);
    setValidateBody({ action, cellphone: undefined });
  }, [ValidatePhoneError, ValidatePhoneSuccess]);

  useEffect(() => {
    if (open) refetchSelf();
  }, [open]);

  useEffect(() => {
    if (
      Self &&
      Self?.cellphone &&
      !Self?.phone_validated &&
      !validationPhoneSent
    ) {
      setValidateBody({
        action: "USER_VALIDATE_PHONE",
        cellphone: `+${Self?.cellphone.split("+")[1]}`,
      });
    }

    if (
      Self &&
      !Self?.cellphone &&
      body?.cellphone &&
      !Self?.phone_validated &&
      !validationPhoneSent &&
      editSelf
    ) {
      setValidateBody({
        action: "USER_VALIDATE_PHONE",
        cellphone: `+${body?.cellphone.split("+")[1]}`,
      });
    }

    if (
      Self &&
      Self?.cellphone &&
      Self?.phone_validated &&
      !validationTokenSent
    ) {
      setTokenState("");
      setValidateBody({
        action,
        cellphone:
          Self && Self?.cellphone
            ? `+${Self?.cellphone.split("+")[1]}`
            : undefined,
      });
    }

    setValidationTokenSent(true);
  }, [Self, body]);

  useEffect(() => {
    if (!validationPhoneSent || !validationTokenSent) {
      ValidateToken();
    }
  }, [validateBody, validationPhoneSent, validationTokenSent]);

  useEffect(() => {
    if (success || ValidatePhoneSuccess) {
      message.success(
        t("messages.action_success", {
          action: t("messages.validated"),
        })
      );
      setIsOpen(false);
    }

    if (error || ValidatePhoneError) {
      message.error(
        t("messages.action_error", {
          action: t("messages.validated"),
        })
      );
    }
  }, [success, error, ValidatePhoneSuccess, ValidatePhoneError]);

  return Self?.phone_validated ? (
    <Modal
      centered
      title={t("modal.validate_token")}
      open={open}
      onCancel={() => {
        setIsOpen(false);
        setValidationPhoneSent(false);
        setValidationTokenSent(false);
        setValidateBody({ action, cellphone: undefined });
      }}
      footer={[
        <Grid
          container
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          spacing={1}
        >
          <Grid item xs={12} md={4}>
            <Countdown
              key="count"
              success={ValidateTokenSuccess}
              quantSeconds={tokenData?.expiration}
            />
          </Grid>
          <Grid xs={12} md={8}>
            <Button
              style={{ marginLeft: "150px" }}
              loading={ValidateTokenLoading}
              key="submit"
              type="primary"
              onClick={() => {
                submit();
                setValidationPhoneSent(false);
                setValidationTokenSent(false);
                setValidateBody({ action, cellphone: undefined });
              }}
            >
              {t("modal.confirm")}
            </Button>
          </Grid>
        </Grid>,
      ]}
    >
      <Typography.Text>{t("messages.validate_text")}</Typography.Text>
      <Grid
        container
        justifyContent="center"
        style={{ marginTop: 16, marginBottom: 16 }}
      >
        <OTPInput
          containerStyle={{
            gap: "8px",
            display: "flex",
            justifyContent: "center",
          }}
          value={tokenState.toUpperCase()}
          onChange={setTokenState}
          numInputs={6}
          renderInput={(props) => <input {...props} />}
          shouldAutoFocus
          inputType="tel"
          inputStyle={{
            width: "10%",
            height: "5vw",
            minWidth: "30px",
            minHeight: "30px",
            borderRadius: "5px",
            border: "2px solid #c9c9c9",
            fontSize: "22px",
          }}
        />
      </Grid>
      <Grid container justifyContent="flex-end">
        <Button
          type="link"
          disabled={!ableToResend}
          onClick={() => {
            setValidateBody({
              action,
              cellphone: `+${Self?.cellphone.split("+")[1]}`,
            });
            ValidateToken();
          }}
        >
          {t("modal.resend_token_by_sms")}
        </Button>
      </Grid>
    </Modal>
  ) : Self?.cellphone || body?.cellphone ? (
    <Modal
      centered
      title={t("modal.validate_phone_number")}
      open={open}
      onCancel={() => {
        setIsOpen(false);
        setValidationPhoneSent(false);
        setValidationTokenSent(false);
        setValidateBody({ action, cellphone: undefined });
      }}
      footer={[
        <Grid
          container
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          spacing={1}
        >
          <Grid item xs={12} md={4}>
            <Countdown
              key="count"
              success={ValidateTokenSuccess}
              quantSeconds={tokenData?.expiration}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Button
              style={{ marginLeft: "150px" }}
              loading={ValidatePhoneLoading}
              key="submit"
              type="primary"
              onClick={() => {
                ValidatePhone();
                setValidationPhoneSent(false);
                setValidationTokenSent(false);
                setValidateBody({ action, cellphone: undefined });
              }}
            >
              {t("modal.confirm")}
            </Button>
          </Grid>
        </Grid>,
      ]}
    >
      {Self?.cellphone || editSelf ? (
        <>
          {" "}
          <Typography.Text>{t("messages.validate_phone_text")}</Typography.Text>
          <Grid
            container
            justifyContent="center"
            style={{ marginTop: 16, marginBottom: 16 }}
          >
            <OTPInput
              containerStyle={{
                gap: "8px",
                display: "flex",
                justifyContent: "center",
              }}
              value={tokenState.toUpperCase()}
              onChange={setTokenState}
              numInputs={6}
              renderInput={(props) => <input {...props} />}
              shouldAutoFocus
              inputType="tel"
              inputStyle={{
                width: "10%",
                height: "5vw",
                minWidth: "30px",
                minHeight: "30px",
                borderRadius: "5px",
                border: "2px solid #c9c9c9",
                fontSize: "22px",
              }}
            />
          </Grid>
          <Grid container justifyContent="flex-end">
            <Button
              type="link"
              disabled={!ableToResend}
              onClick={() => {
                setValidateBody({
                  action: "USER_VALIDATE_PHONE",
                  cellphone: Self?.cellphone,
                });
                ValidateToken();
              }}
            >
              {t("modal.resend_token_by_sms")}
            </Button>
          </Grid>
        </>
      ) : (
        <Typography.Text strong>{t("messages.no_cellphone")}</Typography.Text>
      )}

      {/*   <Toast
        actionSuccess={t("messages.validated")}
        actionError={t("messages.validate")}
        error={ValidatePhoneError}
        success={ValidatePhoneSuccess}
      />
      <Toast
        actionSuccess={t("messages.validated")}
        actionError={t("messages.validate")}
        error={error}
        success={success}
      /> */}
    </Modal>
  ) : (
    <Modal
      centered
      title={t("modal.validate_phone_number")}
      open={open}
      onCancel={() => {
        setIsOpen(false);
        setValidationPhoneSent(false);
        setValidationTokenSent(false);
        setValidateBody({ action, cellphone: undefined });
      }}
    ></Modal>
  );
};
