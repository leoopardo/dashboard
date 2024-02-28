/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCreateOrganizationUser } from "@services/register/organization/users/createUser";
import { useUpdateOrganizationUser } from "@services/register/organization/users/updateUser";
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
  action: "create" | "update";
}

export interface NewUserInterface {
  name?: string;
  username?: string;
  password?: string;
  email?: string;
  cellphone?: string;
  group_id?: number;
  type?: number;
  status?: boolean;
  partner_id?: number;
  merchant_id?: number;
  organization_id?: number;
  user_id?: number;
  validation_token?: string;
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
  const { isLoading } = useCreateOrganizationUser({});
  const { updateLoading } = useUpdateOrganizationUser({});

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
