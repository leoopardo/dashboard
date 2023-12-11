/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { PermissionGroupBodyInterface, PermissionsGroupsItemInterface } from "@src/services/types/register/permissionsGroup/permissionsGroupinterface";
import { useMutation } from "react-query";

export function useUpdatePermissionGroup(body: PermissionGroupBodyInterface) {
  const { isLoading, error, mutate, isSuccess, reset, } = useMutation<
  PermissionsGroupsItemInterface | null | undefined
  >("UpdatePermissionGroup", async () => {
    const response = await api.put("core/permission_group/update", body, {});
    await queryClient.refetchQueries({ queryKey: ["PermissionGroups"] });
    return response.data;
  });

  const UpdatePermissionGroupMutate = mutate;
  const UpdatePermissionGroupIsLoading = isLoading;
  const UpdatePermissionGroupError: any = error;
  const UpdatePermissionGroupIsSuccess = isSuccess;
  const UpdatePermissionGroupReset = reset;

  return {
    UpdatePermissionGroupMutate,
    UpdatePermissionGroupReset,
    UpdatePermissionGroupIsLoading,
    UpdatePermissionGroupError,
    UpdatePermissionGroupIsSuccess,
  };
}
