/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import { PermissionsGroupsDataInterface, PermissionsGroupsQueryInterface } from "@src/services/types/register/permissionsGroup/permissionsGroupinterface";
import { useEffect } from "react";
import { useQuery } from "react-query";

export function useGetPermissionGroups(params: PermissionsGroupsQueryInterface) {
  const { data, isFetching, error, isSuccess, refetch } = useQuery<
  PermissionsGroupsDataInterface | null | undefined
  >("PermissionGroups", async () => {
    const response = await api.get("core/permission_group", {
      params,
    });
    return response.data;
  });

  useEffect(() => {
    refetch();
  }, [params]);

  const PermissionGroupsData = data;
  const isPermissionGroupsDataFetching = isFetching;
  const PermissionGroupsDataError: any = error;
  const isSuccessPermissionGroupsData = isSuccess;
  const refetchPermissionGroupsData = refetch;
  return {
    PermissionGroupsData,
    isPermissionGroupsDataFetching,
    PermissionGroupsDataError,
    isSuccessPermissionGroupsData,
    refetchPermissionGroupsData,
  };
}
