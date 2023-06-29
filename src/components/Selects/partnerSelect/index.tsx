import React, { Dispatch, SetStateAction, useEffect, useState, useCallback } from "react";
import { useListPartners } from "../../../services/register/partner/listPartners";
import { AutoComplete, Empty, Input } from "antd";
import { PartnerQuery } from "../../../services/types/register/partners/partners.interface";
import { useTranslation } from "react-i18next";
import { DownOutlined } from "@ant-design/icons";
import useDebounce from "@src/utils/useDebounce";

interface PartnerSelectProps {
  setQueryFunction: Dispatch<SetStateAction<any>>;
  queryOptions: any;
}

export const PartnerSelect = ({
  setQueryFunction,
  queryOptions,
}: PartnerSelectProps) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState<PartnerQuery>({
    page: 1,
    limit: 200,
  });
  const { partnersData, refetcPartners } = useListPartners(query);
  const [value, setValue] = useState<any>(null);
  const debounceSearch = useDebounce(query.name);

  useEffect(() => {
    if (partnersData && !value) {
      const initial = queryOptions.partner_id 
      ? partnersData?.items.find(
        (partner) => partner.id === queryOptions.partner_id)
      : partnersData?.items.find(
        (partner) => partner.id === queryOptions.partner?.id
      );
      if (initial) {
        setValue(initial?.name);
      }
    }
  }, [partnersData, queryOptions]);

  useEffect(() => {
    if (partnersData) {
      const initial = partnersData?.items.find(
        (partner) => partner.id === queryOptions?.partner_id
      );
      if (initial) {
        setValue(initial?.name);
      }
    }
  }, [queryOptions]);

  useEffect(() => {
    refetcPartners();
  }, [debounceSearch]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event?.target?.value;
    setQuery((state) => ({ ...state, name: val }));
  };

  return (
    <AutoComplete
      size="large"
      options={
        partnersData?.items?.map((item, index) => {
          return { key: index, value: item.id, label: item.name };
        }) ?? []
      }
      notFoundContent={<Empty />}
      value={value}
      style={{ width: "100%", height: 40 }}
      onChange={(value) => {
        setValue(value)
      }}
      onSelect={(value) =>
        setQueryFunction((state: any) => ({ ...state, partner_id: value }))
      }
      onInputKeyDown={(event: any) => {
        handleChange(event);
      }}
      placeholder={t("table.partner_name")}
    />
  );
};
