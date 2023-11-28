/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";
import {
  GroupQuery,
  GroupResponse,
} from "../../../types/register/organization/organizationUsers.interface";

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
