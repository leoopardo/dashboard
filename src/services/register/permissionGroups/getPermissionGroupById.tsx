/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import { PermissionGroupInterface } from "@src/services/types/register/permissionsGroup/permissionsGroupinterface";
import { useQuery } from "react-query";

export function useGetPermissionGroup(id?: number) {
  const { data, isFetching, error, isSuccess, refetch } = useQuery<
    PermissionGroupInterface | null | undefined
  >("PermissionGroupById", async () => {
    const response = await api.get(`core/permission_group/${id}`, {
      params: { permissions: true },
    });
    return response.data;
  });

  const PermissionGroupData = data;
  const isPermissionGroupDataFetching = isFetching;
  const PermissionGroupDataError: any = error;
  const isSuccessPermissionGroupData = isSuccess;
  const refetchPermissionGroupData = refetch;
  return {
    PermissionGroupData,
    isPermissionGroupDataFetching,
    PermissionGroupDataError,
    isSuccessPermissionGroupData,
    refetchPermissionGroupData,
  };
}
