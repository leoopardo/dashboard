/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useListMerchantById } from "@src/services/merchant/getListMerchantById";
import useDebounce from "@src/utils/useDebounce";
import { Select } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useListMerchants } from "../../../services/merchant/listMerchants";
import { MerchantQuery } from "../../../services/types/register/merchants/merchants.interface";

interface MerchantSelectProps {
  setQueryFunction: Dispatch<SetStateAction<any>>;
  queryOptions: any;
  name?: boolean;
  multiple?: boolean;
}

export const MerchantSelect = ({
  setQueryFunction,
  queryOptions,
  name,
  multiple,
}: MerchantSelectProps) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState<MerchantQuery>({
    page: 1,
    limit: 200,
    sort_field: "name",
    sort_order: "ASC",
    partner_id: queryOptions?.partner_id,
  });
  const { merchantsData, refetcMerchant, isMerchantFetching } =
    useListMerchants(query);
  const { merchant } = useListMerchantById({
    page: 1,
    limit: 200,
    merchant_id: queryOptions.merchant_id ?? undefined,
  });

  const [value, setValue] = useState<any>(undefined);
  const debounceSearch = useDebounce(query.name);
  const [options, setOptions] = useState<any | undefined>();

  function getUniqueObjectsByName(arr: any[]): any[] {
    const uniqueObjects = arr.reduce((uniqueArr, obj) => {
      const foundObj = uniqueArr.find((item: any) => item.name === obj.name);
      if (!foundObj) {
        uniqueArr.push(obj);
      }
      return uniqueArr;
    }, []);

    return uniqueObjects;
  }

  useEffect(() => {
    if (!queryOptions?.merchant_id) {
      setValue(undefined);
      if (merchantsData) {
        setOptions([...merchantsData.items]);
      }
    }

    if (queryOptions.merchant_id && merchant && merchantsData) {
      setOptions([...merchantsData.items, merchant]);
    }

    if (!value && queryOptions.merchant_id && merchant) {
      setValue(merchant?.name);
    }
  }, [merchantsData, merchant, queryOptions]);

  useEffect(() => {
    setQuery((state) => ({
      ...state,
      partner_id: queryOptions.partner_id,
      aggregator_id: queryOptions.aggregator_id,
      operator_id: queryOptions.operator_id,
    }));
  }, [debounceSearch, queryOptions]);

  useEffect(() => {
    refetcMerchant();
  }, [debounceSearch, query]);

  return (
    <Select
      data-test-id="merchant-select"
      allowClear
      mode={multiple ? "multiple" : undefined}
      style={{ width: "100%" }}
      showSearch
      size="large"
      loading={isMerchantFetching}
      value={value}
      onClear={() => {
        setQueryFunction((state: any) => ({
          ...state,
          [multiple ? "merchants_ids" : "merchant_id"]: null,
          group_id: undefined,
        }));
      }}
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
      onChange={(value, option) => {
        if (!value) {
          setValue(undefined);
          setQueryFunction((state: any) => ({
            ...state,
            merchant_name: undefined,
            [multiple ? "merchants_ids" : "merchant_id"]: undefined,
            group_id: undefined,
          }));
          return;
        }
        setQueryFunction((state: any) => ({
          ...state,
          merchant_name: name ? (option as any)["label"] : undefined,
          [multiple ? "merchants_ids" : "merchant_id"]: value,
          group_id: undefined,
        }));
        setValue(
          merchantsData?.items.find((merchant) => merchant.id === value)?.name
        );
      }}
      options={
        options
          ? getUniqueObjectsByName(options)?.map((merch: any) => {
              return {
                label: merch.name,
                value: merch.id,
              };
            })
          : []
      }
      filterOption={(input, option) => {
        return (
          `${option?.label}`?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0
        );
      }}
      placeholder={t("table.merchant_name")}
    />
  );
};
