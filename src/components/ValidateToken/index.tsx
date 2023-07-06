/* eslint-disable react-hooks/exhaustive-deps */
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useValidateToken } from "../../services/sendValidationToken";
import { Button, Modal } from "antd";
import OTPInput from "react-otp-input";
import Countdown from "../countdown";
import { useGetSelf } from "../../services/getSelf";
import { useValidatePhone } from "../../services/sendValidationPhone";
import { Toast } from "../Toast";

interface ValidateTokenProps {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  body?: any;
  action: string;
  tokenState: string;
  setTokenState: Dispatch<SetStateAction<string>>;
  success?: boolean;
  error: any;
  submit: () => void;
}

export const ValidateToken = ({
  open,
  setIsOpen,
  action,
  tokenState,
  setTokenState,
  body,
  submit,
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
  } = useValidateToken(validateBody, (validationTokenSent || validationPhoneSent));
  const {
    ValidatePhone,
    ValidatePhoneLoading,
    ValidatePhoneError,
    ValidatePhoneSuccess,
  } = useValidatePhone({ validation_token: tokenState });

  const [ableToResend, setAbleToResend] = useState<boolean>(true);


  useEffect(() => {
    refetchSelf();
    setValidationPhoneSent(false);
    setValidationTokenSent(false);
    setValidateBody({ action, cellphone: undefined });
  }, [ValidatePhoneError, ValidatePhoneSuccess]);

  useEffect(() => {
    if (Self && !Self?.phone_validated && !validationPhoneSent) {
      setValidateBody({
        action: "USER_VALIDATE_PHONE",
        cellphone: body && body?.cellphone ? body?.cellphone : Self?.cellphone,
      });
      setValidationPhoneSent(true);
    }

    if (Self && Self?.phone_validated && !validationTokenSent) {
      setTokenState("");
      setValidateBody({
        action,
        cellphone: body && body?.cellphone ? `+${body?.cellphone}` : undefined,
      });
      setValidationTokenSent(true);
    }
  }, [Self, body]);

  useEffect(() => {
    if (!validationPhoneSent || !validationTokenSent) {
      ValidateToken();
    }
  }, [validateBody, validationPhoneSent, validationTokenSent]);

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
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p></p>
          <Countdown
            key="count"
            success={ValidateTokenSuccess}
            quantSeconds={tokenData?.expiration}
          />
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
        </Grid>,
      ]}
    >
      <Grid container justifyContent="center">
        <OTPInput
          containerStyle={{ gap: "20px" }}
          value={tokenState.toUpperCase()}
          onChange={setTokenState}
          numInputs={6}
          renderInput={(props) => <input {...props} />}
          shouldAutoFocus
          inputType="tel"
          inputStyle={{
            width: "40px",
            height: "50px",
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
            setValidateBody({ action, cellphone: `+${Self?.cellphone}` });
            ValidateToken();
          }}
        >
          {t("modal.resend_token_by_sms")}
        </Button>
      </Grid>
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
      footer={[
        <Grid
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p></p>
          <Countdown
            key="count"
            success={ValidateTokenSuccess}
            quantSeconds={tokenData?.expiration}
          />
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
        </Grid>,
      ]}
    >
      <Grid container justifyContent="center">
        <OTPInput
          containerStyle={{ gap: "20px" }}
          value={tokenState.toUpperCase()}
          onChange={setTokenState}
          numInputs={6}
          renderInput={(props) => <input {...props} />}
          shouldAutoFocus
          inputType="tel"
          inputStyle={{
            width: "40px",
            height: "50px",
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

      <Toast
        actionSuccess={t("messages.validated")}
        actionError={t("messages.validated")}
        error={ValidatePhoneError}
        success={ValidatePhoneSuccess}
      />
    </Modal>
  );
};
