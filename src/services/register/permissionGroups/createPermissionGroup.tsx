/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { PermissionGroupBodyInterface, PermissionsGroupsItemInterface } from "@src/services/types/register/permissionsGroup/permissionsGroupinterface";
import { useMutation } from "react-query";

export function useCreatePermissionGroup(body: PermissionGroupBodyInterface) {
  const { isLoading, error, mutate, isSuccess, reset, data } = useMutation<
  PermissionsGroupsItemInterface | null | undefined
  >("CreatePermissionGroup", async () => {
    const response = await api.post("core/permission_group", body, {});
    await queryClient.refetchQueries({ queryKey: ["PermissionGroups"] });
    return response.data;
  });

  const PermissionGroupMutate = mutate;
  const PermissionGroupIsLoading = isLoading;
  const PermissionGroupError: any = error;
  const PermissionGroupIsSuccess = isSuccess;
  const PermissionGroupReset = reset;

  return {
    PermissionGroupMutate,
    PermissionGroupReset,
    PermissionGroupIsLoading,
    PermissionGroupError,
    PermissionGroupIsSuccess,
    data
  };
}
