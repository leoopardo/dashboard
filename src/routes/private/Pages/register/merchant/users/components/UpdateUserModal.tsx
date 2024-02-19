/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCreateMerchantUser } from "@services/register/merchant/users/createUser";
import { useUpdateMerchant } from "@services/register/merchant/users/updateMerhchant";
import {
  MerchantUserBodyItem,
  MerchantUsersItem,
} from "@services/types/register/merchants/merchantUsers.interface";
import { Button, Drawer, FormInstance } from "antd";
import React, { Dispatch, SetStateAction, useRef } from "react";
import { useTranslation } from "react-i18next";
import { UpdateUserModalFields } from "./UpdateUserModalFields";

interface NewuserModalprops {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  currentUser?: MerchantUsersItem | null;
  setCurrentUser?: Dispatch<SetStateAction<MerchantUsersItem | null>>;
  setUpdateBody?: Dispatch<SetStateAction<MerchantUserBodyItem | null>>;
  setIsValidateTokenOpen?: Dispatch<SetStateAction<boolean>>;
  action: "create" | "update";
}
export const UpdateUserModal = ({
  open,
  setOpen,
  currentUser,
  setCurrentUser,
  setUpdateBody,
  setIsValidateTokenOpen,
  action,
}: NewuserModalprops) => {
  const { t } = useTranslation();
  const submitRef = useRef<HTMLButtonElement>(null);
  const formRef = React.useRef<FormInstance>(null);
  const { isLoading } = useCreateMerchantUser({});
  const { updateIsLoading } = useUpdateMerchant({});

  return (
    <Drawer
      open={open}
      onClose={() => {
        setOpen(false);
        formRef.current?.resetFields();
        if (setCurrentUser) setCurrentUser(null);
      }}
      bodyStyle={{ overflowX: "hidden" }}
      title={
        action === "update" ? t("buttons.update_user") : t("buttons.new_user")
      }
      footer={
        <Button
          data-test-id="submit-button"
          loading={action === "update" ? updateIsLoading : isLoading}
          type="primary"
          style={{ width: "100%" }}
          size="large"
          onClick={() => submitRef.current?.click()}
        >
          {action === "update" ? t("buttons.update") : t("buttons.create")}
        </Button>
      }
    >
      {open && (
        <UpdateUserModalFields
          action={action}
          setOpen={setOpen}
          currentUser={currentUser}
          formRef={formRef}
          setCurrentUser={setCurrentUser}
          setIsValidateTokenOpen={setIsValidateTokenOpen}
          setUpdateBody={setUpdateBody}
          submitRef={submitRef}
        />
      )}
    </Drawer>
  );
};
