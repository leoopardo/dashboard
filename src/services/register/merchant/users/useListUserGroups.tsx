import { useEffect, useState } from "react";
import { api } from "../../../../config/api";
import {
  GroupQuery,
  GroupResponse,
} from "../../../types/register/organization/organizationUsers.interface";
import { useQuery } from "react-query";

export function useListUserGroups(params: GroupQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    GroupResponse | null | undefined
  >(
    "OrganizationGroup",
    async () => {
      const response = await api.get("core/permission/group", {
        params,
      });
      return response.data;
    },
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
    }
  );

  useEffect(() => {
    refetch();
  }, [params]);

  const groupsData = data;
  const isGroupsFetching = isFetching;
  const groupsError: any = error;
  const refetcGroups = refetch;

  return {
    groupsData,
    isGroupsFetching,
    groupsError,
    refetcGroups,
  };
}
