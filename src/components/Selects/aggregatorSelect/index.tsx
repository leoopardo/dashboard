/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetAggregators } from "@src/services/register/aggregator/getAggregators";
import { AggregatorQuery } from "@src/services/types/register/aggregators/aggregators.interface";
import useDebounce from "@src/utils/useDebounce";
import { AutoComplete, Empty } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface MerchantSelectProps {
  setQueryFunction: Dispatch<SetStateAction<any>>;
  aggregatorId: any;
}

export const AggregatorSelect = ({
  setQueryFunction,
  aggregatorId,
}: MerchantSelectProps) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState<AggregatorQuery>({
    page: 1,
    limit: 200,
    name: "",
  });
  const { AggregatorsData, refetchAggregatorsData } = useGetAggregators(query);
  const [value, setValue] = useState<any>(null);
  const debounceSearch = useDebounce(query.name);

  useEffect(() => {
    if (AggregatorsData && !value) {
      const initial = AggregatorsData?.items.find(
        (aggregator) => aggregator.id === aggregatorId
      );
      if (initial) {
        setValue(initial?.name);
      }
    }
  }, [aggregatorId, AggregatorsData]);

  useEffect(() => {
    if (AggregatorsData) {
      const initial = AggregatorsData?.items.find(
        (aggregator) => aggregator.id === aggregatorId
      );
      if (initial) {
        setValue(initial?.name);
      }
    }
  }, [aggregatorId]);

  useEffect(() => {
    refetchAggregatorsData();
  }, [debounceSearch]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event?.target?.value;
    setQuery((state) => ({ ...state, name: val }));
  };

  return (
    <AutoComplete
      size="large"
      options={
        AggregatorsData?.items?.map((item, index) => {
          return { key: index, value: item.id, label: item.name };
        }) ?? []
      }
      value={value}
      notFoundContent={<Empty />}
      onChange={(e) => {
        setValue(e);
      }}
      style={{ width: "100%", height: 40 }}
      onSelect={(value) =>
        setQueryFunction((state: any) => ({
          ...state,
          aggregator_id: value,
          group_id: null,
        }))
      }
      onInputKeyDown={(event: any) => {
        handleChange(event);
      }}
      placeholder={t("input.aggregator")}
    />
  );
};
