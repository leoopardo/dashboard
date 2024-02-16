/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Drawer, FormInstance } from "antd";
import { Dispatch, SetStateAction, useRef } from "react";
import { useTranslation } from "react-i18next";
import { MutateModalFields } from "./mutateGenericFields";

interface mutateProps {
  type: "create" | "update";
  fields:
    | (
        | {
            label: string;
            type?: string;
            head?: string;
            required: boolean;
            selectOption?: boolean;
            noTranslate?: boolean;
            feesDetails?: boolean;
            asyncOption?: {
              options?: any[];
              optionLabel?: string;
              optionValue?: string;
              bodyProp?: string;
            };
          }
        | undefined
      )[];
  modalName: string;
  selectOptions?: any;
  setBody: Dispatch<SetStateAction<any>>;
  body: any;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  submit: () => void;
  submitLoading: boolean;
  success: boolean;
  error: any;
  clear?: any;
  submitText?: string;
  validateToken?: boolean;
  validateTokenAction?: string;
  merchantBetweenAccounts?: boolean;
  query?: any;
}

export const MutateModal = ({
  type,
  body,
  fields,
  open,
  setBody,
  setOpen,
  submit,
  selectOptions,
  modalName,
  submitLoading,
  clear,
  submitText,
  validateToken,
  validateTokenAction,
  success,
  error,
  merchantBetweenAccounts,
  query,
}: mutateProps) => {
  const { t } = useTranslation();
  const formRef = useRef<FormInstance>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  return (
    <Drawer
      open={open}
      onClose={() => {
        setOpen(false);
        formRef.current?.resetFields();
        if (type === "create") setBody({});
      }}
      bodyStyle={{ overflowX: "hidden" }}
      title={modalName}
      footerStyle={{ padding: 0 }}
      footer={
        <Button
          data-test-id="submit-button"
          loading={submitLoading}
          type="primary"
          style={{ width: "100%" }}
          size="large"
          onClick={() => submitRef.current?.click()}
        >
          {submitText
            ? submitText
            : type == "create"
            ? t("buttons.create")
            : t("buttons.update")}
        </Button>
      }
    >
        {/* Foi criado um componente somente para os campos do modal 
      pois da forma que estava a animação de fechar o modal nao acontecia
      da forma correta pois estava o modal estava sendo exibido 
      de acordo com a variável "open", dessa forma os campos são exibidos
      com o "open" e o modal pode ser fechado normalmente */}
      
      {open && (
        <MutateModalFields
          body={body}
          error={error}
          fields={fields}
          modalName={modalName}
          open={open}
          setBody={setBody}
          setOpen={setOpen}
          submit={submit}
          submitLoading={submitLoading}
          success={success}
          type={type}
          clear={clear}
          merchantBetweenAccounts={merchantBetweenAccounts}
          query={query}
          selectOptions={selectOptions}
          submitText={submitText}
          validateToken={validateToken}
          validateTokenAction={validateTokenAction}
          formRef={formRef}
          submitRef={submitRef}
        />
      )}
    </Drawer>
  );
};
