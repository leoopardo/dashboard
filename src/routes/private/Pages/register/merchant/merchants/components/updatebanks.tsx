import { BanksSelect } from "@src/components/Selects/bankSelect";
import { useListBanks } from "@src/services/bank/listBanks";
import { useUpdateBankConfig } from "@src/services/register/merchant/merchant/bankConfig/updateBankConfig";
import { IMerchantBankUpdate } from "@src/services/types/register/merchants/merchantBankConfig.interface";
import { Avatar, Button, Drawer, Form, Select } from "antd";
import { FormInstance } from "antd/lib/form/Form";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface UpdateBanksInterface {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const UpdateBanks = ({ open, setOpen }: UpdateBanksInterface) => {
  const { t } = useTranslation();
  const formRef = useRef<FormInstance>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const [body, setBody] = useState<IMerchantBankUpdate>({});
  const { bankListData } = useListBanks({ limit: 200, page: 1 });
  const { UpdateIsLoading, UpdateIsSuccess, UpdateError, UpdateMutate } =
    useUpdateBankConfig();

  return (
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
      <Form
        ref={formRef}
        layout="vertical"
        disabled={UpdateIsLoading}
        onFinish={() => {
          UpdateMutate();
          setOpen(false);
        }}
      >
        <Form.Item
          label={t(`input.deposit_bank`)}
          name="deposit"
          style={{ margin: 10 }}
          rules={[
            {
              required: true,
              message:
                t("input.required", {
                  field: t(`table.bank`),
                }) || "",
            },
          ]}
        >
          <Select
          size="large"
            options={
              bankListData?.itens?.map((item, index) => {
                return {
                  key: index,
                  value: item.label_name,
                  label: (
                    <>
                      <Avatar src={item.icon_url} style={{ marginRight: 10 }} />
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
              required: true,
              message:
                t("input.required", {
                  field: t(`table.bank`),
                }) || "",
            },
          ]}
        >
          <Select
          size="large"
            options={
              bankListData?.itens?.map((item, index) => {
                return {
                  key: index,
                  value: item.label_name,
                  label: (
                    <>
                      <Avatar src={item.icon_url} style={{ marginRight: 10 }} />
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
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <button type="submit" ref={submitRef} style={{ display: "none" }}>
            Submit
          </button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};
