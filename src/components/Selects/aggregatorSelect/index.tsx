/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useListAggregators } from "@src/services/register/aggregator/listAggregators";
import { AggregatorQuery } from "@src/services/types/register/aggregators/aggregators.interface";
import useDebounce from "@src/utils/useDebounce";
import { Select } from "antd";
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
  const { aggregatorsData, refetcAggregators, isAggregatorsFetching } =
    useListAggregators(query);
  const [value, setValue] = useState<any>(null);
  const debounceSearch = useDebounce(query.name);

  useEffect(() => {
    if (aggregatorsData && !value) {
      const initial = aggregatorsData?.items.find(
        (aggregator) => aggregator.id === aggregatorId
      );
      if (initial) {
        setValue(initial?.name);
      }
    }
  }, [aggregatorId, aggregatorsData]);

  useEffect(() => {
    if (aggregatorsData) {
      const initial = aggregatorsData?.items.find(
        (aggregator) => aggregator.id === aggregatorId
      );
      if (initial) {
        setValue(initial?.name);
      }
    }
  }, [aggregatorId]);

  useEffect(() => {
    refetcAggregators();
  }, [debounceSearch]);

  return (
    <Select
      showSearch
      size="large"
      loading={isAggregatorsFetching}
      value={value}
      onSelect={() => {
        delete query.name;
        refetcAggregators();
      }}
      onSearch={(value) => {
        if (value === "") {
          delete query.name;
          refetcAggregators();
          return;
        }

        setQuery((state: any) => ({ ...state, name: value }));
      }}
      onChange={(value) => {
        setQueryFunction((state: any) => ({
          ...state,
          aggregator_id: value,
          group_id: undefined,
        }));
        setValue(
          aggregatorsData?.items.find(
            (aggregator) => aggregator.id === aggregatorId
          )?.name
        );
      }}
      options={aggregatorsData?.items.map((aggregator) => {
        return {
          label: aggregator.name,
          value: aggregator.id,
        };
      })}
      filterOption={(input, option) => {
        return (
          `${option?.label}`?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0
        );
      }}
      placeholder={t("table.aggregator_name")}
    />
  );
};
