import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useListPartners } from "../../../services/register/partner/listPartners";
import { AutoComplete, Empty, Input } from "antd";
import { PartnerQuery } from "../../../services/types/register/partners/partners.interface";
import { useTranslation } from "react-i18next";
import { DownOutlined } from "@ant-design/icons";

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

  useEffect(() => {
    setValue(
      partnersData?.items.find(
        (partner) => partner.id === queryOptions.partner_id
      )?.name
    );
  }, [partnersData, queryOptions]);

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
      onChange={(value) => setValue(value)}
      onSelect={(value) =>
        setQueryFunction((state: any) => ({ ...state, partner_id: value }))
      }
      onInputKeyDown={(event: any) => {
        setQuery((state) => ({ ...state, name: event.target.value }));
        refetcPartners();
      }}
      placeholder={t("table.partner_name")}
    />
  );
};
