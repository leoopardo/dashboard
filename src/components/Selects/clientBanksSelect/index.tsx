import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AutoComplete, Empty, Input } from "antd";
import { MerchantQuery } from "../../../services/types/merchants.interface";
import { useTranslation } from "react-i18next";
import { useListClientClientBanks } from "../../../services/bank/listClientBanks";
import { DownOutlined } from "@ant-design/icons";

interface BankSelectProps {
  setQueryFunction: Dispatch<SetStateAction<any>>;
  queryOptions: any;
}

export const ClientBanksSelect = ({
  setQueryFunction,
  queryOptions,
}: BankSelectProps) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState<MerchantQuery>({
    page: 1,
    limit: 200,
  });
  const { clientbankListData } = useListClientClientBanks(query);
  const [value, setValue] = useState<any>(null);

  useEffect(() => {
    setValue(
      clientbankListData?.items.find(
        (bank) => bank.bank_code === queryOptions.payer_bank
      )?.bank_name
    );
  }, [clientbankListData, queryOptions]);

  return (
    <AutoComplete
      size="large"
      options={
        clientbankListData?.items?.map((item, index) => {
          return {
            key: index,
            value: item.bank_code,
            label: item.bank_name,
          };
        }) ?? []
      }
      notFoundContent={<Empty />}
      value={value}
      style={{ width: "100%", height: 40 }}
      onChange={(value) => setValue(value)}
      onSelect={(value) =>
        setQueryFunction((state: any) => ({ ...state, payer_bank: value }))
      }
      onInputKeyDown={(event: any) => {
        event.target.value
          ? setQuery((state) => ({ ...state, bank_name: event.target.value }))
          : setQuery({
              page: 1,
              limit: 200,
            });
      }}
      placeholder={t("table.payer_bank")}
    />
  );
};
