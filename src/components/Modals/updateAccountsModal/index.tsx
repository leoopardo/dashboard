import { FC, createRef, useState } from "react";
import { Modal, Button, Form } from "antd";
import CurrentAccountsSelect from "@src/components/Selects/currentAccountsSelect";
import { useTranslation } from "react-i18next";
import { useListMerchants } from "@src/services/merchant/listMerchants";
import { MerchantsResponse } from "@src/services/types/register/merchants/merchantsRegister.interface";
import { queryClient } from "@src/services/queryClient";
import { MerchantSelect } from "@src/components/Selects/merchantSelect";

interface UpdateAccountsModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedFields: any[];
  loading: boolean;
}

const UpdateAccountsModal: FC<UpdateAccountsModalProps> = ({
  open,
  setOpen,
  selectedFields,
  loading,
}) => {
  const { t } = useTranslation();
  const formRef = createRef<any>();
  const [body, setBody] = useState<any>({});
  const [query, setQuery] = useState<any>({});
  const MerchantData: MerchantsResponse | undefined =
    queryClient.getQueryData("MerchantsRegister");
  const { merchantsData, isMerchantFetching } =
    useListMerchants({
      page: 1,
      limit: 400,
      sort_order: "ASC",
      sort_field: "name",
    });
  console.log({ MerchantData });
  console.log({ merchantsData });

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <Modal
        title={`${t("buttons.update")} ${t(
          "table.bank_acc_number"
        ).toLowerCase()}`}
        open={open}
        onCancel={handleCancel}
        okButtonProps={{ disabled: selectedFields.length === 0, loading }}
        onOk={handleOk}
      >
        <Form
          ref={formRef}
          layout="vertical"
          disabled={isMerchantFetching}
          initialValues={body}
          onFinish={() => {
            console.log("test");
          }}
        >
          <Form.Item
            label={`${t(`table.merchant`)}s`}
            name="merchants_ids"
            style={{ margin: 10 }}
          >
            <MerchantSelect
              setQueryFunction={setQuery}
              queryOptions={query}
              multiple
            />
          </Form.Item>

          <Form.Item
            label={t(`table.bank_acc_number`)}
            name="account_id"
            style={{ margin: 10 }}
          >
            <CurrentAccountsSelect
              setBody={setBody}
              body={body}
              query={query}
              setQuery={setQuery}
              filterIdProp={""}
              filterIdValue={undefined}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateAccountsModal;
