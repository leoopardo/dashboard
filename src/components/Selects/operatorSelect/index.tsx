/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetOperator } from "@src/services/register/operator/getOperators";
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
  const { OperatorData, refetchOperatorData } = useGetOperator(query);
  const [value, setValue] = useState<any>(null);
  const debounceSearch = useDebounce(query.name);

  useEffect(() => {
    if (OperatorData && !value) {
      const initial = OperatorData?.items.find(
        (operator) => operator.id === queryOptions?.operator_id
      );
      if (initial) {
        setValue(initial?.name);
      }
    }
  }, [queryOptions, OperatorData]);

  useEffect(() => {
    if (OperatorData) {
      const initial = OperatorData?.items.find(
        (operator) => operator.id === queryOptions?.operator_id
      );
      if (initial) {
        setValue(initial?.name);
      }
    }
  }, [queryOptions]);

  useEffect(() => {
    refetchOperatorData();
  }, [debounceSearch]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event?.target?.value;
    setQuery((state) => ({ ...state, name: val }));
  };

  return (
    <AutoComplete
      size="large"
      options={
        OperatorData?.items?.map((item, index) => {
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
          operator_id: value,
          group_id: null,
        }))
      }
      onInputKeyDown={(event: any) => {
        handleChange(event);
      }}
      placeholder={t("input.operator")}
    />
  );
};
