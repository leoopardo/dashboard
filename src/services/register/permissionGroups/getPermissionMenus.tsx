/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import { PermissionMenuInterface } from "@src/services/types/register/permissionsGroup/permissionsGroupinterface";
import { useQuery } from "react-query";

export function useGetPermissionMenus(params: { group_id: number }) {
  const { data, isFetching, error, isSuccess, refetch } = useQuery<
    PermissionMenuInterface[] | null | undefined
  >("PermissionMenus", async () => {
    const response = await api.get("core/permissions-menu/permissions", {
      params,
    });
    return response.data;
  });

  const PermissionMenusData = data;
  const isPermissionMenusDataFetching = isFetching;
  const PermissionMenusDataError: any = error;
  const isSuccessPermissionMenusData = isSuccess;
  const refetchPermissionMenusData = refetch;
  return {
    PermissionMenusData,
    isPermissionMenusDataFetching,
    PermissionMenusDataError,
    isSuccessPermissionMenusData,
    refetchPermissionMenusData,
  };
}
