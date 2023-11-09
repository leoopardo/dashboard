/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import useDebounce from "@src/utils/useDebounce";
import { Select } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useListPartners } from "../../../services/register/partner/listPartners";
import { PartnerQuery } from "../../../services/types/register/partners/partners.interface";

interface PartnerSelectProps {
  setQueryFunction: Dispatch<SetStateAction<any>>;
  queryOptions: any;
  disabled?: boolean;
}

export const PartnerSelect = ({
  setQueryFunction,
  queryOptions,
  disabled,
}: PartnerSelectProps) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState<PartnerQuery>({
    page: 1,
    limit: 200,
  });
  const { partnersData, refetcPartners, isPartnersFetching } =
    useListPartners(query);
  const [value, setValue] = useState<any>(null);
  const debounceSearch = useDebounce(query.name);

  useEffect(() => {
    if (partnersData && !value) {
      const initial = queryOptions.partner_id
        ? partnersData?.items.find(
            (partner) => partner.id === queryOptions.partner_id
          )
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

  return (
    <Select
      showSearch
      size="large"
      loading={isPartnersFetching}
      disabled={disabled}
      value={value}
      onSelect={() => {
        delete query.name;
        refetcPartners();
      }}
      onSearch={(value) => {
        if (value === "") {
          delete query.name;
          refetcPartners();
          return;
        }

        setQuery((state: any) => ({ ...state, name: value }));
      }}
      onChange={(value) => {
        setQueryFunction((state: any) => ({
          ...state,
          partner_id: value,
          group_id: undefined,
        }));
        setValue(
          partnersData?.items.find(
            (partner) => partner.id === queryOptions.partner_id
          )?.name
        );
      }}
      options={partnersData?.items.map((partner) => {
        return {
          label: partner.name,
          value: partner.id,
        };
      })}
      filterOption={(input, option) => {
        return (
          `${option?.label}`?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0
        );
      }}
      placeholder={t("table.partner_name")}
    />
    // <AutoComplete
    //   size="large"
    //   options={
    //     partnersData?.items?.map((item, index) => {
    //       return { key: index, value: item.id, label: item.name };
    //     }) ?? []
    //   }
    //   disabled={disabled}
    //   notFoundContent={<Empty />}
    //   value={value}
    //   style={{ width: "100%", height: 40 }}
    //   onChange={(value) => {
    //     if (!value) {
    //       delete queryOptions.partner_id;
    //       setValue("");
    //       setQueryFunction((state: any) => ({
    //         ...state,
    //         partner_id: undefined,
    //       }));
    //     }
    //     setValue(value);
    //   }}
    //   onSelect={(value) =>
    //     setQueryFunction((state: any) => ({ ...state, partner_id: value }))
    //   }
    //   onInputKeyDown={(event: any) => {
    //     handleChange(event);
    //   }}
    //   placeholder={t("table.partner_name")}
    // />
  );
};
