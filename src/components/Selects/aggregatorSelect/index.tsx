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
  multiple?: boolean;
}

export const AggregatorSelect = ({
  setQueryFunction,
  aggregatorId,
  multiple
}: MerchantSelectProps) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState<AggregatorQuery>({
    page: 1,
    limit: 200,
    name: "",
    sort_order: "ASC",
    sort_field: "name",
  });
  const { aggregatorsData, refetcAggregators, isAggregatorsFetching } =
    useListAggregators(query);
  const [value, setValue] = useState<any>(undefined);
  const debounceSearch = useDebounce(query.name, 500);

  
  useEffect(() => {
    if (!aggregatorId) {
      setValue(undefined);
    }
    if (aggregatorsData && !value) {
      const initial = aggregatorsData?.items.find(
            (aggregator) => aggregator.id === aggregatorId
          )
    
      if (initial) {
        setValue(initial?.name);
      }
    }
  }, [aggregatorsData, aggregatorId]);

  useEffect(() => {
    if (aggregatorId) {
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

  // useEffect(() => {
  //   if (!aggregatorId) {
  //     setValue(undefined);
  //   }
  //   if (aggregatorsData && !value) {
  //     const initial = aggregatorsData?.items.find(
  //       (aggregator) => aggregator.id === aggregatorId
  //     );
  //     if (initial) {
  //       setValue(initial?.name);
  //     }
  //   }
  // }, [aggregatorId, aggregatorsData]);

  // useEffect(() => {
  //   if (aggregatorsData) {
  //     const initial = aggregatorsData?.items.find(
  //       (aggregator) => aggregator.id === aggregatorId
  //     );
  //     if (initial) {
  //       setValue(initial?.name);
  //     }
  //   }
  // }, [aggregatorId]);

  // useEffect(() => {
  //   refetcAggregators();
  // }, [debounceSearch]);

  return (
    <Select
      data-test-id="aggregator-select"
      allowClear
      showSearch
      mode={multiple ?  "multiple" : undefined}
      size="large"
      loading={isAggregatorsFetching}
      value={value}
      onClear={() => {
        setQueryFunction((state: any) => ({
          ...state,
          [multiple ? "aggregators_ids" : "aggregator_id"]: null,
          group_id: undefined,
        }));
      }}
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
        if (!value) {
          setValue(undefined);
          setQueryFunction((state: any) => ({
            ...state,
            [multiple ? "aggregators_ids" : "aggregator_id"]: undefined,
            group_id: undefined,
            operator_id: undefined,
          }));
          return;
        }
        setQueryFunction((state: any) => ({
          ...state,
          [multiple ? "aggregators_ids" : "aggregator_id"]: value,
          group_id: undefined,
          operator_id: undefined,
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
