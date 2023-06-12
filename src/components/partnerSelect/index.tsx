import React, { Dispatch, SetStateAction, useState } from "react";
import { useListPartners } from "../../services/partner/listPartners";
import { AutoComplete } from "antd";
import { PartnerQuery } from "../../services/types/partnerTypes";

interface PartnerSelectProps {
  setQueryFunction: Dispatch<SetStateAction<any>>;
  queryOptions: any;
}

export const PartnerSelect = ({
  setQueryFunction,
  queryOptions,
}: PartnerSelectProps) => {
  const [query, setQuery] = useState<PartnerQuery>({
    page: 1,
    limit: 200,
  });
  const { partnersData, refetcPartners, isPartnersFetching } =
    useListPartners(query);
  const [value, setValue] = useState<any>(
    partnersData?.items.find(
      (partner) => partner.id === queryOptions.partner_id
    )?.name
  );
  return (
    <AutoComplete
      options={
        partnersData?.items?.map((item) => {
          return { value: item.id, label: item.name };
        }) ?? []
      }
      value={value}
      style={{ width: "100%", height: 40 }}
      onChange={(value) => setValue(value)}
      onSelect={(value) =>
        setQueryFunction((state: any) => ({ ...state, partner_id: value }))
      }
      filterOption={(inputValue, option) => {
        return option!.label.indexOf(inputValue.toUpperCase()) !== -1;
      }}
      onInputKeyDown={(event: any) => {
        setQuery((state) => ({ ...state, name: event.target.value }));
        refetcPartners();
      }}
      placeholder="Plataformas"
    />
  );
};
