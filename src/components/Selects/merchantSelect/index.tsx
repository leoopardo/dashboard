import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AutoComplete, Empty } from "antd";
import { MerchantQuery } from "../../../services/types/register/merchants/merchants.interface";
import { useListMerchants } from "../../../services/merchant/listMerchants";
import { useTranslation } from "react-i18next";
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
    partner_id: queryOptions?.partner_id,
  });
  const { merchantsData, refetcMerchant, isMerchantFetching, merchantError } =
    useListMerchants(query);
  const [value, setValue] = useState<any>(null);
  const debounceSearch = useDebounce(query.name);

  useEffect(() => {
    if (!value) {
      const initial = merchantsData?.items.find(
        (merchant) => merchant.id === queryOptions.merchant_id
      );
      if (initial) {
        setValue(initial?.name);
      }
    }
  }, [merchantsData, queryOptions]);

  useEffect(() => {
    setQuery((state) => ({ ...state, partner_id: queryOptions.partner_id }));
  }, [queryOptions]);

  useEffect(() => {
    refetcMerchant();
  }, [debounceSearch, query]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event?.target?.value;
    setQuery((state) => ({ ...state, name: val }));
  };

  return (
    <AutoComplete
      size="large"
      disabled={merchantError}
      options={
        merchantsData?.items?.map((item, index) => {
          return { key: index, value: item.id, label: item.name };
        }) ?? []
      }
      notFoundContent={<Empty />}
      value={value}
      style={{ width: "100%", height: 40 }}
      onChange={(value, option) => {
        if (!value) {
          delete queryOptions.merchant_id;
          setValue("");
          setQueryFunction((state: any) => ({
            ...state,
            merchant_id: undefined,
          }));
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
