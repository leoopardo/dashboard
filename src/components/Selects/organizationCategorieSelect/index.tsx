import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AutoComplete, Empty } from "antd";
import { useTranslation } from "react-i18next";
import { OperatorQuery } from "@src/services/types/register/operators/operators.interface";
import { useGetOperator } from "@src/services/register/operator/getOperators";
import useDebounce from "@src/utils/useDebounce";
import { OrganizationCategoriesQuery } from "@src/services/types/register/organization/organizationCategories.interface";
import { useGetOrganizationCategories } from "@src/services/register/organization/categories/getCategories";

interface CategorieSelectProps {
  setQueryFunction: Dispatch<SetStateAction<any>>;
  queryOptions: any;
}

export const OrganizationCategorieSelect = ({
  setQueryFunction,
  queryOptions,
}: CategorieSelectProps) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState<OrganizationCategoriesQuery>({
    page: 1,
    limit: 200,
    name: "",
  });
  const { CategoriesData, refetchCategoriesData } = useGetOrganizationCategories(query);
  const [value, setValue] = useState<any>(null);
  const debounceSearch = useDebounce(query.name);

  useEffect(() => {
    if (CategoriesData && !value) {
      const initial = CategoriesData?.items.find(
        (operator) => operator.id === queryOptions?.category_id
      );
      if (initial) {
        setValue(initial?.name);
      }
    }
  }, [queryOptions, CategoriesData]);

  useEffect(() => {
    if (CategoriesData) {
      const initial = CategoriesData?.items.find(
        (operator) => operator.id === queryOptions?.category_id
      );
      if (initial) {
        setValue(initial?.name);
      }
    }
  }, [queryOptions]);

  useEffect(() => {
    refetchCategoriesData();
  }, [debounceSearch]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event?.target?.value;
    setQuery((state) => ({ ...state, name: val }));
  };

  return (
    <AutoComplete
      size="large"
      options={
        CategoriesData?.items?.map((item, index) => {
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
          category_id: value,
        }))
      }
      onInputKeyDown={(event: any) => {
        handleChange(event);
      }}
      placeholder={t("input.category")}
    />
  );
};
