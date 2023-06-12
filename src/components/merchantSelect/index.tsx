import React, { Dispatch, SetStateAction, useState } from "react";
import { AutoComplete, Spin } from "antd";
import { MerchantQuery } from "../../services/types/merchantsTypes";
import { useListMerchants } from "../../services/merchant/listMerchants";

interface MerchantSelectProps {
  setQueryFunction: Dispatch<SetStateAction<any>>;
  queryOptions: any;
}

export const MerchantSelect = ({
  setQueryFunction,
  queryOptions,
}: MerchantSelectProps) => {
  const [query, setQuery] = useState<MerchantQuery>({
    page: 1,
    limit: 200,
  });
  const { merchantsData, refetcMerchant, isMerchantFetching } =
    useListMerchants(query);
  const [value, setValue] = useState<any>(
    merchantsData?.items.find(
      (partner) => partner.id === queryOptions.merchant_id
    )?.name
  );
  return (
    <AutoComplete
      options={
        merchantsData?.items?.map((item) => {
          return { value: item.id, label: item.name };
        }) ?? []
      }
      notFoundContent={<Spin />}
      value={value}
      style={{ width: "100%", height: 40 }}
      onChange={(value) => setValue(value)}
      onSelect={(value) =>
        setQueryFunction((state: any) => ({ ...state, merchant_id: value }))
      }
      filterOption={(inputValue, option) => {
        return option!.label.indexOf(inputValue) !== -1;
      }}
      onInputKeyDown={(event: any) => {
        setQuery((state) => ({ ...state, name: event.target.value }));
        refetcMerchant();
        console.log(event);
      }}
      placeholder="Plataformas"
    />
  );
};
