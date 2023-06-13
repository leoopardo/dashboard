import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AutoComplete, Empty, Input, Spin } from "antd";
import { MerchantQuery } from "../../../services/types/merchants.interface";
import { useListMerchants } from "../../../services/merchant/listMerchants";
import { useTranslation } from "react-i18next";
import { DownOutlined } from "@ant-design/icons";

interface MerchantSelectProps {
  setQueryFunction: Dispatch<SetStateAction<any>>;
  queryOptions: any;
}

export const MerchantSelect = ({
  setQueryFunction,
  queryOptions,
}: MerchantSelectProps) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState<MerchantQuery>({
    page: 1,
    limit: 200,
  });
  const { merchantsData, refetcMerchant, isMerchantFetching } =
    useListMerchants(query);
  const [value, setValue] = useState<any>(null);

  useEffect(() => {
    setValue(
      merchantsData?.items.find(
        (partner) => partner.id === queryOptions.merchant_id
      )?.name
    );
  }, [merchantsData, queryOptions]);

  return (
    <AutoComplete
      size="large"
      options={
        merchantsData?.items?.map((item, index) => {
          return { key: index, value: item.id, label: item.name };
        }) ?? []
      }
      notFoundContent={<Empty />}
      value={value}
      style={{ width: "100%", height: 40 }}
      onChange={(value) => setValue(value)}
      onSelect={(value) =>
        setQueryFunction((state: any) => ({ ...state, merchant_id: value }))
      }
      onInputKeyDown={(event: any) => {
        setQuery((state) => ({ ...state, name: event.target.value }));
      }}
      placeholder={t("table.merchant_name")}
    />
  );
};
