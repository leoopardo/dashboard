/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useListBanks } from "@src/services/bank/listBanks";
import { Avatar, Empty, Select } from "antd";
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { MerchantQuery } from "../../../services/types/register/merchants/merchants.interface";

interface BankSelectProps {
  setQueryFunction: Dispatch<SetStateAction<any>>;
  queryOptions?: any;
  onChange?: (value: string) => void;
  currentValue?: any;
  setCurrentValue?: Dispatch<SetStateAction<any>>;
  field?: string;
}

export const BanksSelect = ({
  setQueryFunction,
  queryOptions,
  currentValue,
  setCurrentValue,
  field,
}: BankSelectProps) => {
  const { t } = useTranslation();
  const [query] = useState<MerchantQuery>({
    page: 1,
    limit: 200,
  });
  const { bankListData } = useListBanks(query);
  const [value, setValue] = useState<any>(
    field
      ? bankListData?.itens?.find(
          (bank) => bank?.label_name === queryOptions[field]
        )?.label_name
      : null
  );

  return (
    <Select
      size="large"
      options={
        bankListData?.itens?.map((item, index) => {
          return {
            key: index,
            value: item.bank,
            label: (
              <>
                <Avatar src={item.icon_url} style={{ marginRight: 10 }} />
                {item?.label_name}
              </>
            ),
          };
        }) ?? []
      }
      onClear={() => {
        const q = { ...queryOptions };
        delete q[field || "bank"];
        setQueryFunction(q);
      }}
      allowClear
      notFoundContent={<Empty />}
      value={currentValue || value}
      style={{ width: "100%", height: 40 }}
      onChange={(value) =>
        setCurrentValue ? setCurrentValue(value) : setValue(value)
      }
      onSelect={(value) =>
        setQueryFunction((state: any) => ({
          ...state,
          [field ?? "bank"]: value,
        }))
      }
      placeholder={t("table.bank")}
    />
  );
};
