/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCreatePartnerUser } from "@src/services/register/partner/users/createUser";
import { useUpdatePartnerUser } from "@src/services/register/partner/users/updateUser";
import { OrganizationUserItem } from "@src/services/types/register/organization/organizationUsers.interface";
import { Button, Drawer, FormInstance } from "antd";
import React, { Dispatch, SetStateAction, useRef } from "react";
import { useTranslation } from "react-i18next";
import { NewUserModalFields } from "./newUserModalFields";
interface NewuserModalprops {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  currentUser?: OrganizationUserItem | null;
  setCurrentUser?: Dispatch<SetStateAction<NewUserInterface | null>>;
  setUpdateBody?: Dispatch<SetStateAction<NewUserInterface | null>>;
  setIsValidateTokenOpen?: Dispatch<SetStateAction<boolean>>;
  action?: "create" | "update";
}

export interface NewUserInterface {
  name: string;
  username: string;
  password?: string;
  email?: string;
  cellphone?: string;
  group_id: number;
  type?: number;
  status: boolean;
  partner_id?: number;
  merchant_id?: number;
  user_id?: number;
}

export const NewUserModal = ({
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
  const { isLoading } = useCreatePartnerUser({});
  const { updateLoading } = useUpdatePartnerUser({});

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
          loading={action === "update" ? updateLoading : isLoading}
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
        <NewUserModalFields
          setOpen={setOpen}
          action={action}
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
