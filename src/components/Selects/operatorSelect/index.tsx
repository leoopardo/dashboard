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
  multiple?: boolean;
}

export const OperatorSelect = ({
  setQueryFunction,
  queryOptions,
  multiple
}: operatorSelectProps) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState<OperatorQuery>({
    page: 1,
    limit: 200,
    sort_field: "name",
    sort_order: "ASC",
    aggregator_id:
      queryOptions?.aggregator_id || queryOptions?.aggregator?.id || undefined,
    name: "",
  });
  const { operatorsData, refetcOperators, isOperatorsFetching } =
    useListOperators(query);
  const [value, setValue] = useState<any>(undefined);
  const debounceSearch = useDebounce(query.name);

  useEffect(() => {
    if (!queryOptions?.operator_id) {
      setValue(undefined);
    }
    if (!value) {
      const initial = operatorsData?.items.find(
        (operator) =>
          operator.id ===
          (queryOptions?.operator?.id || queryOptions?.operator_id)
      );
      if (initial) {
        setValue(initial?.name);
      }
    }
  }, [queryOptions, operatorsData]);

  useEffect(() => {
    setQuery((state) => ({
      ...state,
      aggregator_id:
        queryOptions?.aggregator_id ?? queryOptions?.aggregator?.id,
    }));
  }, [queryOptions]);

  useEffect(() => {
    refetcOperators();
  }, [query]);

  useEffect(() => {
    if (!queryOptions?.aggregator_id)
      setQueryFunction((state: any) => ({
        ...state,
        [multiple ? "operators_ids" : "operator_id"]: null,
        group_id: undefined,
      }));
  }, [queryOptions?.aggregator_id]);

  useEffect(() => {
    refetcOperators();
  }, [debounceSearch]);

  useEffect(() => {
    if (
      !operatorsData?.items.some(
        (operator) => operator?.id === queryOptions?.operator_id
      )
    ) {
      return setValue(undefined);
    }
  }, [operatorsData]);

  return (
    <Select
      data-test-id="operator-select"
      allowClear
      showSearch
      mode={ multiple ? "multiple" : undefined}
      size="large"
      loading={isOperatorsFetching}
      value={value}
      onClear={() => {
        setQueryFunction((state: any) => ({
          ...state,
          [multiple ? "operators_ids" : "operator_id"]: null,
          group_id: undefined,
        }));
      }}
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
        if (!value) {
          setValue(undefined);
          setQueryFunction((state: any) => ({
            ...state,
            [multiple ? "operators_ids" : "operator_id"]: undefined,
            group_id: undefined,
          }));
          return;
        }
        setQueryFunction((state: any) => ({
          ...state,
          [multiple ? "operators_ids" : "operator_id"] : value,
          group_id: undefined,
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
