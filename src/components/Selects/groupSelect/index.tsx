/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AutoComplete, Empty } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useListUserGroups } from "../../../services/register/organization/users/useListUserGroups";
import { GroupQuery } from "../../../services/types/register/organization/organizationUsers.interface";

interface GroupSelectProps {
  setBody: Dispatch<SetStateAction<any>>;
  body: any;
  filterIdProp: string;
  filterIdValue: number | undefined;
}

export const GroupSelect = ({
  setBody,
  body,
  filterIdProp,
  filterIdValue,
}: GroupSelectProps) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState<GroupQuery>({
    page: 1,
    limit: 200,
    [filterIdProp]: filterIdValue,
  });
  const { groupsData, refetcGroups } = useListUserGroups(query);

  useEffect(() => {
    setQuery((state) => ({ ...state, [filterIdProp]: filterIdValue }));
  }, [filterIdProp, filterIdValue]);

  useEffect(() => {
    refetcGroups();
  }, [query]);

  return (
    <AutoComplete
      size="large"
      disabled={!filterIdValue}
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
      onChange={(_event: any, option: any) => {
        setQuery((state) => ({ ...state, name: option.label }));
      }}
      onSelect={(value) =>
        setBody((state: any) => ({ ...state, group_id: value }))
      }
      onInputKeyDown={(event: any) => {
        setQuery((state) => ({ ...state, name: event.target.value }));
      }}
      onKeyDown={(event) => {
        if (event.code === "Backspace") {
          delete body.group_id;
          setQuery({
            page: 1,
            limit: 200,
          });
        }
      }}
      placeholder={t("table.group")}
    />
  );
};
