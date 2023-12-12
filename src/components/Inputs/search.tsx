/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface SearchInterface {
  query: any;
  setQuery: Dispatch<SetStateAction<any>>;
  searchOption?: string;
}

export const Search = ({ query, setQuery, searchOption }: SearchInterface) => {
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    if (!query[searchOption as any] && search) {
      setSearch("");
    }
  }, [query, searchOption]);

  return (
    <Input.Search
      size="large"
      placeholder="Pesquisa"
      value={search}
      disabled={!searchOption}
      
      style={{ width: "100%" }}
      onChange={(event) => {
        setSearch(event.target.value);
      }}
      onSearch={(value) =>
        setQuery((state: any) => ({ ...state, [searchOption as any]: value }))
      }
    />
  );
};
