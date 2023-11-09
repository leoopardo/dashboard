/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import useDebounce from "@src/utils/useDebounce";
import { Select } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useListMerchants } from "../../../services/merchant/listMerchants";
import { MerchantQuery } from "../../../services/types/register/merchants/merchants.interface";

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
  const { merchantsData, refetcMerchant, isMerchantFetching } =
    useListMerchants(query);
  const [value, setValue] = useState<any>(null);
  const debounceSearch = useDebounce(query.name);
  useEffect(() => {
    if (!queryOptions.merchant_id) {
      setValue(undefined);
    }
    if (!value) {
      const initial = merchantsData?.items.find(
        (merchant) => merchant.id === (queryOptions?.merchant_id || queryOptions?.merchant?.id)
      );
      if (initial) {
        setValue(initial?.name);
      }
    }
  }, [merchantsData, queryOptions]);

  useEffect(() => {
    setQuery((state) => ({
      ...state,
      partner_id: queryOptions.partner_id,
      aggregator_id: queryOptions.partner_id,
      operator_id: queryOptions.operator_id,
    }));
  }, [debounceSearch, queryOptions]);

  useEffect(() => {
    refetcMerchant();
  }, [debounceSearch, query]);

  return (
    <Select
      allowClear
      style={{ width: "100%" }}
      showSearch
      size="large"
      loading={isMerchantFetching}
      value={value}
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
        if (!value) {
          setValue(undefined);
          setQueryFunction((state: any) => ({
            ...state,
            merchant_id: undefined,
            group_id: undefined,
          }));
          return;
        }
        setQueryFunction((state: any) => ({
          ...state,
          merchant_id: value,
          group_id: undefined,
        }));
        setValue(
          merchantsData?.items.find(
            (merchant) => merchant.id === queryOptions.merchant_id
          )?.name
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
          `${option?.label}`?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0
        );
      }}
      placeholder={t("table.merchant_name")}
    />
  );
};
