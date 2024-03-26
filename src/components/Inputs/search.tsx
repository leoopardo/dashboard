/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface SearchInterface {
  query: any;
  setQuery: Dispatch<SetStateAction<any>>;
  searchOption?: string;
}

export const Search = ({ query, setQuery, searchOption }: SearchInterface) => {
  const [search, setSearch] = useState<string | undefined>(undefined);
  const { t } = useTranslation();

  useEffect(() => {
    if (!searchOption && search) {
      setSearch(undefined);
    }

  }, [searchOption, search]);

  return (
    <Input.Search
      readOnly={!searchOption}
      size="large"
      placeholder={`${t("table.search")}`}
      value={search}
      style={{ width: "100%" }}
      onChange={(event) => {
        if (!searchOption) return;
        setSearch(event.target.value);
      }}
      onSearch={(value) => {
        if (!value) {
          const q = { ...query };
          delete q[searchOption as any];
          setQuery(q);
          return;
        }
        setQuery((state: any) => ({ ...state, [searchOption as any]: value }));
      }}
      allowClear
    />
  );
};
