/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Select, Empty } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useListUserGroups } from "../../../services/register/organization/users/useListUserGroups";
import { GroupQuery } from "../../../services/types/register/organization/organizationUsers.interface";
import useDebounce from "@src/utils/useDebounce";

interface GroupSelectProps {
  setBody: Dispatch<SetStateAction<any>>;
  body: any;
  filterIdProp: string;
  filterIdValue: number | undefined;
  notClearble?: boolean;
}

export const GroupSelect = ({
  setBody,
  body,
  filterIdProp,
  filterIdValue,
  notClearble
}: GroupSelectProps) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState<GroupQuery>({
    page: 1,
    limit: 200,
    sort_field: "name",
    sort_order: "ASC",
    [filterIdProp]: filterIdValue,
  });
  const { groupsData, refetcGroups, isGroupsFetching } = useListUserGroups(query);
  const debounceSearch = useDebounce(query.filterIdProp);

  useEffect(() => {
    setQuery((state) => ({ ...state, [filterIdProp]: filterIdValue }));
  }, [filterIdProp, filterIdValue]);
  

  useEffect(() => {
    refetcGroups();
  }, [debounceSearch]);

  return (
    <Select
    data-test-id="group-select"
      allowClear={!notClearble}
      showSearch
      size="large"
      loading={isGroupsFetching}
      disabled={!filterIdValue}
      onSearch={(value) => {
        if (value === "") {
          delete query.filterIdProp;
          return;
        }

        setQuery((state: any) => ({ ...state, filterIdProp: value }));
      }}
      options={
        groupsData?.items?.map((item, index) => {
          return { key: index, value: item.id, label: item.name };
        }) ?? []
      }
      value={
        body?.group_id === null
          ? null
          : (groupsData?.items.find((group) => group?.id === body?.group_id)
              ?.name ||
              query.name) ??
            ""
      }
      notFoundContent={<Empty />}
      style={{ width: "100%", height: 40 }}
      filterOption={(input, option) => {
        return (
          `${option?.label}`?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0
        );
      }}
      onChange={(value) => {
        setBody((state: any) => ({ ...state, group_id: value }))
      }}
     /*  onSelect={(value) =>
        refetcGroups()
      } */
     
      placeholder={t("table.group")}
    />
  );
};
