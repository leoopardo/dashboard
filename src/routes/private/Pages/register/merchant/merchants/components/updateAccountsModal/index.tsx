/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button, Form, Drawer, FormInstance, Select } from "antd";
import CurrentAccountsSelect from "@src/components/Selects/currentAccountsSelect";
import { useTranslation } from "react-i18next";
import { OperatorSelect } from "@src/components/Selects/operatorSelect";
import { AggregatorSelect } from "@src/components/Selects/aggregatorSelect";
import { PartnerSelect } from "@src/components/Selects/partnerSelect";
import { useUpdateMerchantAccount } from "@src/services/register/merchant/merchant/updateMerchantAccount";
import { EditOutlined } from "@ant-design/icons";
import { Toast } from "@src/components/Toast";
import {
  MerchantsItem,
  MerchantsResponse,
} from "@src/services/types/register/merchants/merchantsRegister.interface";
import { useListMerchants } from "@src/services/merchant/listMerchants";
import { queryClient } from "@src/services/queryClient";

interface UpdateAccountsModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedFields: any[];
  loading: boolean;
  items: (MerchantsItem | undefined)[] | null | undefined;
  setItems: Dispatch<
    SetStateAction<
      (MerchantsItem | undefined | { id: number })[] | null | undefined
    >
  >;
}

const UpdateAccountsModal: FC<UpdateAccountsModalProps> = ({
  open,
  setOpen,
  loading,
  items,
  setItems,
}) => {
  const { t } = useTranslation();
  const formRef = useRef<FormInstance>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const [query, setQuery] = useState<any>({
    merchants_ids: items?.map((merchant) => merchant?.id),
  });

  const { merchantsData, isMerchantFetching, refetcMerchant } =
    useListMerchants({
      page: 1,
      limit: 200,
      sort_order: "ASC",
      sort_field: "name",
    });

  const MerchantData: MerchantsResponse | undefined =
    queryClient.getQueryData("MerchantsRegister");

  const removeNullAndEmptyProps = (obj: any) => {
    const newObj = { ...obj };
    Object.keys(newObj).forEach((key) => {
      if (newObj[key] === null || newObj[key]?.length === 0) {
        delete newObj[key];
      }
    });
    return newObj;
  };

  const { UpdateMutate, UpdateError, UpdateIsLoading, UpdateIsSuccess } =
    useUpdateMerchantAccount(removeNullAndEmptyProps(query));

  const showModal = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (UpdateIsSuccess) {
      setOpen(false);
      formRef.current?.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UpdateIsSuccess]);

  useEffect(() => {
    setQuery((state: any) => ({
      ...state,
      merchants_ids: items?.map((merchant) => merchant?.id),
    }));
    formRef.current?.setFieldsValue({
      merchants_ids: items?.map((merchant) => merchant?.id),
    });
  }, [items]);

  return (
    <>
      <Button
        type="primary"
        style={{
          height: 40,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={showModal}
      >
        <EditOutlined />
        {t("buttons.update_menu", { menu: t("table.account") })}
      </Button>
      <Drawer
        open={open}
        onClose={() => {
          setOpen(false);
          formRef.current?.resetFields();
        }}
        bodyStyle={{ overflowX: "hidden" }}
        title={`${t("buttons.update")} ${t(
          "table.bank_acc_number"
        ).toLowerCase()}`}
        footer={
          <Button
            loading={UpdateIsLoading}
            type="primary"
            style={{ width: "100%" }}
            size="large"
            onClick={() => submitRef.current?.click()}
          >
            {t("buttons.update")}
          </Button>
        }
      >
        <Form
          ref={formRef}
          layout="vertical"
          disabled={loading}
          initialValues={query}
          onFinish={() => {
            UpdateMutate();
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
            label={t(`table.merchant`)}
            name="merchants_ids"
            style={{ margin: 10 }}
          >
            <Select
              mode="multiple"
              size="large"
              loading={isMerchantFetching}
              value={query.merchants_ids}
              onSelect={() => {
                delete query.name;
                refetcMerchant();
              }}
              onSearch={(value) => {
                if (value === "") {
                  delete query.name;
                  refetcMerchant();
                  return;
                }

                setQuery((state: any) => ({ ...state, name: value }));
              }}
              onChange={(value) => {
                setQuery((state: any) => ({ ...state, merchants_ids: value }));
                setItems(
                  value.map((id: any) => {
                    return (
                      MerchantData?.items.find((merch) => merch.id === id) ?? {
                        id,
                      }
                    );
                  })
                );
              }}
              options={merchantsData?.items.map((merch) => {
                return {
                  label: merch.name,
                  value: merch.id,
                };
              })}
              filterOption={(input, option) => {
                return (
                  `${option?.label}`
                    ?.toLowerCase()
                    ?.indexOf(input?.toLowerCase()) >= 0
                );
              }}
            />
          </Form.Item>

          <Form.Item
            label={t(`table.bank_acc_number`)}
            name="account_id"
            style={{ margin: 10 }}
            rules={[
              {
                required: query.account_id === undefined,
                message:
                  t("input.required", {
                    field: t(`table.bank_acc_number`).toLowerCase(),
                  }) || "",
              },
            ]}
          >
            <CurrentAccountsSelect
              setBody={setQuery}
              body={query}
              query={query}
              setQuery={setQuery}
              filterIdProp={""}
              filterIdValue={undefined}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <button type="submit" ref={submitRef} style={{ display: "none" }}>
              Submit
            </button>
          </Form.Item>
        </Form>
      </Drawer>

      <Toast
        actionSuccess={t("messages.updated")}
        actionError={t("messages.update")}
        error={UpdateError}
        success={UpdateIsSuccess}
      />
    </>
  );
};

export default UpdateAccountsModal;
