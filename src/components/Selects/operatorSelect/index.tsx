/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useListOperators } from "@src/services/register/operator/listOperators";
import { OperatorQuery } from "@src/services/types/register/operators/operators.interface";
import useDebounce from "@src/utils/useDebounce";
import { Select } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface operatorSelectProps {
  setQueryFunction: Dispatch<SetStateAction<any>>;
  queryOptions: any;
}

export const OperatorSelect = ({
  setQueryFunction,
  queryOptions,
}: operatorSelectProps) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState<OperatorQuery>({
    page: 1,
    limit: 200,
    name: "",
  });
  const { operatorsData, refetcOperators, isOperatorsFetching } =
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

  return (
    <Select
      showSearch
      size="large"
      loading={isOperatorsFetching}
      value={value}
      onSelect={() => {
        delete query.name;
        refetcOperators();
      }}
      onSearch={(value) => {
        if (value === "") {
          delete query.name;
          refetcOperators();
          return;
        }

        setQuery((state: any) => ({ ...state, name: value }));
      }}
      onChange={(value) => {
        setQueryFunction((state: any) => ({
          ...state,
          operator_id: value,
          group_id: null,
        }));
        setValue(
          operatorsData?.items.find((operator) => operator.id === value)?.name
        );
      }}
      options={operatorsData?.items.map((operator) => {
        return {
          label: operator.name,
          value: operator.id,
        };
      })}
      filterOption={(input, option) => {
        return (
          `${option?.label}`?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0
        );
      }}
      placeholder={t("input.operator")}
    />
   
  );
};
