import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AutoComplete, Empty } from "antd";
import { useTranslation } from "react-i18next";
import useDebounce from "@src/utils/useDebounce";
import { AggregatorQuery } from "@src/services/types/register/aggregators/aggregators.interface";
import { useGetAggregators } from "@src/services/register/aggregator/getAggregators";

interface MerchantSelectProps {
  setQueryFunction: Dispatch<SetStateAction<any>>;
  queryOptions: any;
}

export const AggregatorSelect = ({
  setQueryFunction,
  queryOptions,
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
        (operator) => operator.id === queryOptions?.aggregator_id
      );
      if (initial) {
        setValue(initial?.name);
      }
    }
  }, [queryOptions, AggregatorsData]);

  useEffect(() => {
    if (AggregatorsData) {
      const initial = AggregatorsData?.items.find(
        (operator) => operator.id === queryOptions?.aggregator_id
      );
      if (initial) {
        setValue(initial?.name);
      }
    }
  }, [queryOptions]);

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
        console.log(e);
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
