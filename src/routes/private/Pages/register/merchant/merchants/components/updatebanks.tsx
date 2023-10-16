/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Avatar, Button, Drawer, Form, Radio, Select } from "antd";
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
  const [body, setBody] = useState<IMerchantBankUpdate>({
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
  const [query] = useState<any>({
    page: 1,
    limit: 200,
    sort_order: "ASC",
    sort_field: "name",
  });

  const { merchantsData } = useListMerchants(query);
  const MerchantData: MerchantsResponse | undefined =
    queryClient.getQueryData("MerchantsRegister");

  const [all, setAll] = useState<"all" | "partner">("all");

  useEffect(() => {
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
        {!items?.length && !body.merchants_ids?.length && (
          <Radio.Group
            onChange={(e) => {
              setAll(e.target.value);
              if (e.target.value === "all")
                setBody((state) => ({ ...state, partner_id: undefined }));
            }}
            value={all}
          >
            <Radio value="all">Todas as empresas</Radio>
            <Radio value="partner">Plataforma</Radio>
          </Radio.Group>
        )}
        <Form
          ref={formRef}
          layout="vertical"
          disabled={UpdateIsLoading}
          initialValues={body}
          onFinish={() => {
            UpdateMutate();
          }}
        >
          <Form.Item
            label={t(`table.merchant`)}
            name="merchants_ids"
            style={{ margin: 10 }}
          >
            <Select
              mode="multiple"
              size="large"
              value={body.merchants_ids}
              onChange={(value) => {
                setBody((state) => ({ ...state, merchants_ids: value }));
                setItems(
                  value.map((id) => {
                    return (
                      MerchantData?.items.find((merch) => merch.id === id) ?? {
                        id,
                      }
                    );
                  })
                );
                console.log(value);
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
            label={t(`input.deposit_bank`)}
            name="deposit"
            style={{ margin: 10 }}
          >
            <Select
              size="large"
              options={
                bankListData?.itens?.map((item, index) => {
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
          >
            <Select
              size="large"
              options={
                bankListData?.itens?.map((item, index) => {
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
            label={t(`table.partner`)}
            name="withdraw"
            style={{ margin: 10 }}
          >
            <PartnerSelect
              queryOptions={body}
              setQueryFunction={setBody}
              disabled={all === "all"}
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
