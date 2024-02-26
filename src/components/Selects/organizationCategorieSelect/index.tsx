/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetOrganizationCategories } from "@src/services/register/organization/categories/getCategories";
import { OrganizationCategoriesQuery } from "@src/services/types/register/organization/organizationCategories.interface";
import useDebounce from "@src/utils/useDebounce";
import { AutoComplete, Empty } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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
    sort_field: "name",
    sort_order: "ASC",
    name: "",
  });
  const { CategoriesData, refetchCategoriesData } =
    useGetOrganizationCategories(query);
  const [value, setValue] = useState<any>(null);
  const debounceSearch = useDebounce(query.name);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event?.target?.value;
    setQuery((state) => ({ ...state, name: val }));
  };

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

  return (
    <AutoComplete
      size="large"
      options={
        CategoriesData?.items
          ?.filter((categ) => categ.status === true)
          ?.map((item, index) => {
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
