/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetOperator } from "@src/services/register/operator/getOperators";
import { useListOperators } from "@src/services/register/operator/listOperators";
import { OperatorQuery } from "@src/services/types/register/operators/operators.interface";
import useDebounce from "@src/utils/useDebounce";
import { AutoComplete, Empty } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface MerchantSelectProps {
  setQueryFunction: Dispatch<SetStateAction<any>>;
  queryOptions: any;
}

export const OperatorSelect = ({
  setQueryFunction,
  queryOptions,
}: MerchantSelectProps) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState<OperatorQuery>({
    page: 1,
    limit: 200,
    name: "",
  });
  const { operatorsData, refetcOperators, operatorsError } =
    useListOperators(query);
  const [value, setValue] = useState<any>(null);
  const debounceSearch = useDebounce(query.name);

  useEffect(() => {
    if (operatorsData && !value) {
      const initial = operatorsData?.items.find(
        (operator) => operator.id === queryOptions?.operator?.id
      );
      if (initial) {
        setValue(initial?.name);
      }
    }
  }, [queryOptions, operatorsData]);

  useEffect(() => {
    if (operatorsData) {
      const initial = operatorsData?.items.find(
        (operator) => operator.id === queryOptions?.operator?.id
      );
      if (initial) {
        setValue(initial?.name);
      }
    }
  }, [queryOptions]);

  useEffect(() => {
    setQuery((state) => ({
      ...state,
      aggregator_id:
        queryOptions?.aggregator_id ?? queryOptions?.aggregator?.id,
    }));
  }, [debounceSearch, queryOptions]);

  useEffect(() => {
    refetcOperators();
  }, [query]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event?.target?.value;
    setQuery((state) => ({ ...state, name: val }));

    if (!val) {
      setQueryFunction((state: any) => ({
        ...state,
        operator_id: undefined,
      }));
      setValue(undefined);
    }
  };

  return (
    <AutoComplete
      size="large"
      options={
        operatorsError
          ? []
          : operatorsData?.items?.map((item, index) => {
              return { key: index, value: item.id, label: item.name };
            }) ?? []
      }
      value={value}
      notFoundContent={<Empty />}
      onChange={(e) => {
        setValue(e);
      }}
      style={{ width: "100%", height: 40 }}
      onSelect={(value) => {
        setQueryFunction((state: any) => ({
          ...state,
          operator_id: value,
          group_id: null,
        }));
        setValue(
          operatorsData?.items.find((operator) => operator.id === value)?.name
        );
      }}
      onInputKeyDown={(event: any) => {
        handleChange(event);
      }}
      placeholder={t("input.operator")}
    />
  );
};
