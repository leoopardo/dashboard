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
    sort_field: "name",
    sort_order: "ASC",
  });
  const { partnersData, refetcPartners, isPartnersFetching } =
    useListPartners(query);
  const [value, setValue] = useState<any>(null);
  const debounceSearch = useDebounce(query.name);

  useEffect(() => {
    if (!queryOptions?.partner_id) {
      setValue(undefined);
    }
    if (partnersData && !value) {
      const initial = queryOptions?.partner_id
        ? partnersData?.items.find(
            (partner) => partner.id === queryOptions?.partner_id
          )
        : partnersData?.items.find(
            (partner) => partner.id === queryOptions?.partner?.id
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
      data-test-id="partner-select"
      allowClear
      onClear={() => {
        setQueryFunction((state: any) => ({
          ...state,
          partner_id: null,
          group_id: undefined,
        }));
      }}
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
        if (!value) {
          setValue(undefined);
          setQueryFunction((state: any) => ({
            ...state,
            partner_id: undefined,
            merchant_id: undefined,
            group_id: undefined,
          }));
          return;
        }
        setQueryFunction((state: any) => ({
          ...state,
          partner_id: value,
          merchant_id: undefined,
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
  );
};
