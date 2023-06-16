import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useListPartners } from "../../../services/partner/listPartners";
import { AutoComplete, Empty, Input } from "antd";
import { PartnerQuery } from "../../../services/types/partners.interface";
import { useTranslation } from "react-i18next";
import { DownOutlined } from "@ant-design/icons";
import { GroupQuery } from "../../../services/types/organizationUsers.interface";
import { useListUserGroups } from "../../../services/register/organization/users/useListUserGroups";

interface GroupSelectProps {
  setBody: Dispatch<SetStateAction<any>>;
  body: any;
}

export const GroupSelect = ({ setBody, body }: GroupSelectProps) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState<GroupQuery>({
    page: 1,
    limit: 200,
  });
  const { groupsData } = useListUserGroups(query);

  return (
    <AutoComplete
      size="large"
      options={
        groupsData?.items?.map((item, index) => {
          return { key: index, value: item.id, label: item.name };
        }) ?? []
      }
      value={
        groupsData?.items.find((group) => group?.id === body?.group_id)?.name ||
        query.name
      }
      notFoundContent={<Empty />}
      style={{ width: "100%", height: 40 }}
      onChange={(event: any, option) => {
        setQuery((state) => ({ ...state, name: event }));
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
