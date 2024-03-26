/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggregatorSelect } from "@src/components/Selects/aggregatorSelect";
import { OperatorSelect } from "@src/components/Selects/operatorSelect";
import { PartnerSelect } from "@src/components/Selects/partnerSelect";
import { Toast } from "@src/components/Toast";
import { useListBanks } from "@src/services/bank/listBanks";
import { useListMerchants } from "@src/services/merchant/listMerchants";
import { queryClient } from "@src/services/queryClient";
import { useUpdateBankConfig } from "@src/services/register/merchant/merchant/bankConfig/updateBankConfig";
import { IMerchantBankUpdate } from "@src/services/types/register/merchants/merchantBankConfig.interface";
import {
  MerchantsItem,
  MerchantsResponse,
} from "@src/services/types/register/merchants/merchantsRegister.interface";
import { Avatar, Button, Drawer, Form, Radio, Select, Space } from "antd";
import { FormInstance } from "antd/lib/form/Form";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface UpdateBanksInterface {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  items: (MerchantsItem | undefined)[] | null | undefined;
  setItems: Dispatch<
    SetStateAction<
      (MerchantsItem | undefined | { id: number })[] | null | undefined
    >
  >;
}

export const UpdateBanks = ({
  open,
  setOpen,
  items,
  setItems,
}: UpdateBanksInterface) => {
  const { t } = useTranslation();
  const formRef = useRef<FormInstance>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const [body, setBody] = useState<IMerchantBankUpdate | null>({
    merchants_ids: items?.map((merchant) => merchant?.id),
  });
  const { bankListData } = useListBanks({ limit: 200, page: 1 });
  const {
    UpdateIsLoading,
    UpdateMutate,
    reset,
    UpdateBankIsSuccess,
    UpdateBankError,
  } = useUpdateBankConfig({
    ...body,
  });
  const [query, setQuery] = useState<any>({
    page: 1,
    limit: 200,
    sort_order: "ASC",
    sort_field: "name",
  });

  const { merchantsData, isMerchantFetching, refetcMerchant } =
    useListMerchants(query);

  const MerchantData: MerchantsResponse | undefined =
    queryClient.getQueryData("MerchantsRegister");
  const [entity, setEntity] = useState<
    "all" | "aggregators" | "partners" | "operators" | "merchants"
  >("merchants");

  const requiredFields = (field: string, value: number[] | undefined) => {
    if (
      body &&
      (!body[field as keyof IMerchantBankUpdate] ||
        (body[field as keyof IMerchantBankUpdate] as (number | undefined)[])
          ?.length === 0) &&
      (!value || (value as number[])?.length === 0)
    ) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    refetcMerchant();
    setBody((state) => ({
      ...state,
      merchants_ids: items?.map((merchant) => merchant?.id),
    }));
  }, [items]);

  useEffect(() => {
    if (UpdateBankIsSuccess) {
      setOpen(false);
      reset();
    }
  }, [UpdateBankIsSuccess]);

  return (
    <>
      <Drawer
        open={open}
        onClose={() => {
          setOpen(false);
          formRef.current?.resetFields();
        }}
        bodyStyle={{ overflowX: "hidden" }}
        title={`${t("buttons.update")} ${t("table.bank")}`}
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
        <Radio.Group
          onChange={(e) => {
            setEntity(e.target.value);
            setItems(null);
            setBody(null);
            formRef.current?.resetFields();
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
        <Form
          ref={formRef}
          layout="vertical"
          disabled={UpdateIsLoading}
          initialValues={body || {}}
          onFinish={() => {
            UpdateMutate();
          }}
        >
          {entity === "aggregators" && (
            <Form.Item
              label={`${t(`table.aggregators`)}`}
              name="aggregators_ids"
              style={{ margin: 10 }}
              rules={[
                {
                  required:
                    entity === "aggregators" &&
                    (!body?.aggregators_ids ||
                      body?.aggregators_ids?.length === 0),
                  validator(_, value) {
                    if (requiredFields("aggregators_ids", value)) {
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
                setQueryFunction={setBody}
                aggregatorId={body}
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
                    (!body?.partners_ids || body?.partners_ids?.length === 0),
                  validator(_, value) {
                    if (requiredFields("partners_ids", value)) {
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
                setQueryFunction={setBody}
                queryOptions={body}
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
                    (!body?.operators_ids || body?.operators_ids?.length === 0),
                  validator(_, value) {
                    if (requiredFields("operators_ids", value)) {
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
                setQueryFunction={setBody}
                queryOptions={body}
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
                    (!body?.merchants_ids || body?.merchants_ids?.length === 0),
                  validator(_, value) {
                    if (requiredFields("merchants_ids", value)) {
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
                  setBody((state: any) => ({
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
          <Form.Item
            label={t(`input.deposit_bank`)}
            name="deposit"
            style={{ margin: 10 }}
            rules={[
              {
                required: [
                  "cash_in_bank",
                  "cash_out_bank",
                  "fastpix_in_bank",
                ].every((key) =>
                  body ? (body as any)[key] === undefined : true
                ),
                message: t("error.no_banks_selected") || "",
              },
            ]}
          >
            <Select
              size="large"
              allowClear
              options={
                bankListData?.itens
                  ?.filter((bank) => bank?.cash_in && bank.status)
                  ?.map((item, index) => {
                    return {
                      key: index,
                      value: item.bank,
                      label: (
                        <>
                          <Avatar
                            src={item.icon_url}
                            style={{ marginRight: 10 }}
                          />
                          {item.label_name}
                        </>
                      ),
                    };
                  }) ?? []
              }
              onChange={(value) =>
                setBody((state) => ({ ...state, cash_in_bank: value }))
              }
            />
          </Form.Item>
          <Form.Item
            label={t(`input.withdraw_bank`)}
            name="withdraw"
            style={{ margin: 10 }}
            rules={[
              {
                required: [
                  "cash_in_bank",
                  "cash_out_bank",
                  "fastpix_in_bank",
                ].every((key) =>
                  body ? (body as any)[key] === undefined : true
                ),
                message: t("error.no_banks_selected") || "",
              },
            ]}
          >
            <Select
              size="large"
              allowClear
              options={
                bankListData?.itens
                  ?.filter((bank) => bank?.cash_out && bank.status)
                  ?.map((item, index) => {
                    return {
                      key: index,
                      value: item.bank,
                      label: (
                        <>
                          <Avatar
                            src={item.icon_url}
                            style={{ marginRight: 10 }}
                          />
                          {item.label_name}
                        </>
                      ),
                    };
                  }) ?? []
              }
              onChange={(value) =>
                setBody((state) => ({ ...state, cash_out_bank: value }))
              }
            />
          </Form.Item>
          <Form.Item
            label={t(`input.fastpix_in_bank`)}
            name="fastpix_in"
            style={{ margin: 10 }}
            rules={[
              {
                required: [
                  "cash_in_bank",
                  "cash_out_bank",
                  "fastpix_in_bank",
                ].every((key) =>
                  body ? (body as any)[key] === undefined : true
                ),
                message: t("error.no_banks_selected") || "",
              },
            ]}
          >
            <Select
              size="large"
              allowClear
              options={
                bankListData?.itens
                  ?.filter((bank) => bank?.fastpix_in && bank.status)
                  .map((item, index) => {
                    return {
                      key: index,
                      value: item.bank,
                      label: (
                        <>
                          <Avatar
                            src={item.icon_url}
                            style={{ marginRight: 10 }}
                          />
                          {item.label_name}
                        </>
                      ),
                    };
                  }) ?? []
              }
              onChange={(value) =>
                setBody((state) => ({ ...state, fastpix_in_bank: value }))
              }
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
        error={UpdateBankError}
        success={UpdateBankIsSuccess}
      />
    </>
  );
};
