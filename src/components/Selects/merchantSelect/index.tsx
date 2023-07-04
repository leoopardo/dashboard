import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AutoComplete, Empty, Input, Spin } from "antd";
import { MerchantQuery } from "../../../services/types/register/merchants/merchants.interface";
import { useListMerchants } from "../../../services/merchant/listMerchants";
import { useTranslation } from "react-i18next";
import { DownOutlined } from "@ant-design/icons";
import useDebounce from "@src/utils/useDebounce";

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
  const debounceSearch = useDebounce(query.name);

  useEffect(() => {
    if (merchantsData && !value) {
      const initial = merchantsData?.items.find(
        (merchant) => merchant.id === queryOptions.merchant_id
      );
      if (initial) {
        setValue(initial?.name);
      }
    }
  }, [merchantsData, queryOptions]);

  useEffect(() => {
    refetcMerchant();
  }, [debounceSearch]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event?.target?.value;
    setQuery((state) => ({ ...state, name: val }));
  };

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
      onChange={(value) => {
        if (!value) {
          delete queryOptions.merchant_id;
          setValue("");
        }
        setValue(value);
      }}
      onSelect={(value) => {
        setQueryFunction((state: any) => ({ ...state, merchant_id: value }));
        setValue(
          merchantsData?.items.find(
            (merchant) => merchant.id === queryOptions.merchant_id
          )?.name
        );
      }}
      onInputKeyDown={(event: any) => {
        handleChange(event);
      }}
      placeholder={t("table.merchant_name")}
    />
  );
};
