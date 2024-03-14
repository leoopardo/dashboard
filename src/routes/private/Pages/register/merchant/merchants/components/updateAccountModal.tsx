/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button, Form, Drawer, FormInstance, Select, Radio, Space } from "antd";
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
import { IMerchantAccount } from "@src/services/types/register/merchants/merchantConfig.interface";

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
  const [entity, setEntity] = useState<
    "all" | "aggregators" | "partners" | "operators" | "merchants"
  >("merchants");
  const [query, setQuery] = useState<IMerchantAccount | null>({
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

  const requiredFields = (field: string, value: number[] | undefined) => {
    if (
      query &&
      (!query[field as keyof IMerchantAccount] ||
        (query[field as keyof IMerchantAccount] as (number | undefined)[])
          ?.length === 0) &&
      (!value || (value as number[])?.length === 0)
    ) {
      return true;
    }
    return false;
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
      setQuery(null);
      setItems(null);
      setEntity("merchants");
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
        loading={loading}
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
          setItems(null);
          setQuery(null);
          setEntity("merchants");
          formRef.current?.resetFields();
        }}
        bodyStyle={{ overflowX: "hidden" }}
        title={`${t("buttons.update")} ${t(
          "table.bank_acc_number"
        ).toLowerCase()}`}
        footer={
          <Button
            data-test-id="submit-button"
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
          initialValues={query || {}}
          onFinish={() => {
            UpdateMutate();
          }}
        >
          <Radio.Group
            onChange={(e) => {
              setEntity(e.target.value);
              setItems(null);
              setQuery(null);
            }}
            value={entity}
            style={{ marginBottom: 20 }}
          >
            <Space direction="vertical">
              <Radio value="all">{t("table.all_merchants")}</Radio>
              <Radio value="aggregators">{t("table.aggregators")}</Radio>
              <Radio value="merchants">{t("menus.merchants")}</Radio>
              <Radio value="partners">{t("menus.partners")}</Radio>
              <Radio value="operators">{t("menus.operators")}</Radio>
            </Space>
          </Radio.Group>

          <Form.Item
            label={t(`table.bank_acc_number`)}
            name="account_id"
            style={{ margin: 10 }}
            rules={[
              () => ({
                required: !query?.account_id,
                validator(_, value) {
                  if (!query?.account_id && !value) {
                    return Promise.reject(
                      t("input.required", {
                        field: t(`table.bank_acc_number`).toLowerCase(),
                      }) || ""
                    );
                  }
                  return Promise.resolve();
                },
              }),
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

          {entity === "aggregators" && (
            <Form.Item
              label={`${t(`table.aggregators`)}`}
              name="aggregators_ids"
              style={{ margin: 10 }}
              rules={[
                {
                  required:
                    entity === "aggregators" &&
                    (!query?.aggregators_ids ||
                      query?.aggregators_ids?.length === 0),
                  validator(_, value) {
                    if(requiredFields("aggregators_ids", value)) {
                      return Promise.reject(
                        t("input.required", {
                          field: t(`table.aggregator`).toLowerCase(),
                        }) || ""
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <AggregatorSelect
                setQueryFunction={setQuery}
                aggregatorId={query}
                multiple
              />
            </Form.Item>
          )}

          {entity === "partners" && (
            <Form.Item
              label={`${t(`table.partner`)}s`}
              name="partners_ids"
              style={{ margin: 10 }}
              rules={[
                {
                  required:
                    entity === "partners" &&
                    (!query?.partners_ids || query?.partners_ids?.length === 0),
                  validator(_, value) {
                    if(requiredFields("partners_ids", value)) {
                      return Promise.reject(
                        t("input.required", {
                          field: t(`table.partner`).toLowerCase(),
                        }) || ""
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <PartnerSelect
                setQueryFunction={setQuery}
                queryOptions={query}
                multiple
              />
            </Form.Item>
          )}

          {entity === "operators" && (
            <Form.Item
              label={`${t(`table.operators`)}`}
              name="operators_ids"
              style={{ margin: 10 }}
              rules={[
                {
                  required:
                    entity === "operators" &&
                    (!query?.operators_ids ||
                      query?.operators_ids?.length === 0),
                  validator(_, value) {
                    if(requiredFields("operators_ids", value)) {
                      return Promise.reject(
                        t("input.required", {
                          field: t(`table.operator`).toLowerCase(),
                        }) || ""
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <OperatorSelect
                setQueryFunction={setQuery}
                queryOptions={query}
                multiple
              />
            </Form.Item>
          )}

          {entity === "merchants" && (
            <Form.Item
              label={t(`table.merchant`)}
              name="merchants_ids"
              style={{ margin: 10 }}
              rules={[
                {
                  required:
                    entity === "merchants" &&
                    (!query?.merchants_ids ||
                      query?.merchants_ids?.length === 0),
                  validator(_, value) {
                    if(requiredFields("merchants_ids", value)) {
                      return Promise.reject(
                        t("input.required", {
                          field: t(`table.merchant`).toLowerCase(),
                        }) || ""
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Select
                mode="multiple"
                size="large"
                loading={isMerchantFetching}
                value={query?.merchants_ids}
                onSelect={() => {
                  delete query?.name;
                  refetcMerchant();
                }}
                onSearch={(value) => {
                  if (value === "") {
                    delete query?.name;
                    refetcMerchant();
                    return;
                  }

                  setQuery((state: any) => ({ ...state, name: value }));
                }}
                onChange={(value) => {
                  setQuery((state: any) => ({
                    ...state,
                    merchants_ids: value,
                  }));
                  setItems(
                    value.map((id: any) => {
                      return (
                        MerchantData?.items.find(
                          (merch) => merch?.id === id
                        ) ?? {
                          id,
                        }
                      );
                    })
                  );
                }}
                options={merchantsData?.items.map((merch) => {
                  return {
                    label: merch?.name,
                    value: merch?.id,
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
          )}

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
