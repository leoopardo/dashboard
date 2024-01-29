import { FC, createRef, useState } from "react";
import { Modal, Button, Form, Drawer } from "antd";
import CurrentAccountsSelect from "@src/components/Selects/currentAccountsSelect";
import { useTranslation } from "react-i18next";
import { useListMerchants } from "@src/services/merchant/listMerchants";
import { MerchantsResponse } from "@src/services/types/register/merchants/merchantsRegister.interface";
import { queryClient } from "@src/services/queryClient";
import { MerchantSelect } from "@src/components/Selects/merchantSelect";
import { OperatorSelect } from "@src/components/Selects/operatorSelect";
import { AggregatorSelect } from "@src/components/Selects/aggregatorSelect";
import { PartnerSelect } from "@src/components/Selects/partnerSelect";

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
  const { merchantsData, isMerchantFetching } = useListMerchants({
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
      <Button
        style={{
          height: 40,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        type="primary"
        onClick={showModal}
      >
        Atualizar Contas
      </Button>
      <Drawer
        open={open}
        onClose={() => {
          setOpen(false);
          formRef.current?.resetFields();
        }}
        bodyStyle={{ overflowX: "hidden" }}
        title={`${t("buttons.update")} ${t("table.bank_acc_number").toLowerCase()}`}
        footer={
          <Button
            type="primary"
            style={{ width: "100%" }}
            size="large"
         //   onClick={() => submitRef.current?.click()}
          >
            {t("buttons.update")}
          </Button>
        }
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
            label={`${t(`table.aggregator`)}es`}
            name="merchants_ids"
            style={{ margin: 10 }}
          >
            <AggregatorSelect
              setQueryFunction={setQuery}
              aggregatorId={query}
              multiple
            />
          </Form.Item>

          <Form.Item
            label={`${t(`table.partner`)}s`}
            name="merchants_ids"
            style={{ margin: 10 }}
          >
            <PartnerSelect
              setQueryFunction={setQuery}
              queryOptions={query}
              multiple
            />
          </Form.Item>

          <Form.Item
            label={`${t(`table.operator`)}es`}
            name="merchants_ids"
            style={{ margin: 10 }}
          >
            <OperatorSelect
              setQueryFunction={setQuery}
              queryOptions={query}
              multiple
            />
          </Form.Item>

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
      </Drawer>
    </>
  );
};

export default UpdateAccountsModal;
