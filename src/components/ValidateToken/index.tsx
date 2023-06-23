import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useValidateToken } from "../../services/sendValidationToken";
import { Button, Modal } from "antd";
import OTPInput from "react-otp-input";
import Countdown from "../countdown";
import { useGetSelf } from "../../services/getSelf";
import { useValidatePhone } from "../../services/sendValidationPhone";
import { toast } from "react-hot-toast";

interface ValidateTokenProps {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  body: any;
  action: string;
  tokenState: string;
  setTokenState: Dispatch<SetStateAction<string>>;
  success: boolean;
  error: any;
  submit: () => void;
}

export const ValidateToken = ({
  open,
  setIsOpen,
  body,
  action,
  tokenState,
  setTokenState,
  success,
  error,
  submit,
}: ValidateTokenProps) => {
  const { t } = useTranslation();
  const { Self, refetchSelf } = useGetSelf();
  const INITIAL_BODY: {
    action: string;
    cellphone: string | undefined;
  } = { action, cellphone: body?.cellphone };
  const [validateBody, setValidateBody] = useState<{
    action: string;
    cellphone: string | undefined;
  }>({ action, cellphone: body?.cellphone });
  const {
    ValidateToken,
    ValidateTokenError,
    ValidateTokenLoading,
    ValidateTokenSuccess,
    tokenData,
  } = useValidateToken(validateBody);
  const {
    ValidatePhone,
    ValidatePhoneLoading,
    ValidatePhoneError,
    ValidatePhoneSuccess,
  } = useValidatePhone({ validation_token: tokenState });
  const [ableToResend, setAbleToResend] = useState<boolean>(true);


  useEffect(() => {
    refetchSelf();
    if (Self?.phone_validated) {
      setTokenState("");
      setValidateBody(INITIAL_BODY);
      return ValidateToken();
    } else {
      setValidateBody({
        action: "USER_VALIDATE_PHONE",
        cellphone: Self?.cellphone,
      });
    }
  }, [ValidatePhoneError, ValidatePhoneSuccess]);

  useEffect(() => {
    if (validateBody.action === "USER_VALIDATE_PHONE") {
      ValidateToken();
    }
  }, [validateBody]);

  useEffect(() => {
    if (success) setIsOpen(false);
  }, [success]);

  useEffect(() => {
    if (ValidatePhoneSuccess) {
      toast.success("Telefone válidado com sucesso");
    }

    if (ValidatePhoneError) {
      toast.error("Token inválido");
    }
  }, [ValidatePhoneError, ValidatePhoneSuccess]);

  useEffect(() => {
    if (success) {
      toast.success("Dados atualizados com sucesso");
    }

    if (ValidatePhoneError) {
      toast.error("Erro ao atualizar dados");
    }
  }, [success, error]);

  return Self?.phone_validated ? (
    <Modal
      centered
      title={t("modal.validate_token")}
      open={open}
      onCancel={() => setIsOpen(false)}
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
            setValidateBody(INITIAL_BODY);
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
      onCancel={() => setIsOpen(false)}
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
    </Modal>
  );
};
