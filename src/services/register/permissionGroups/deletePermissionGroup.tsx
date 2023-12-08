/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { useMutation } from "react-query";

export function useDeletePermissionGroup(id?: number) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    any | null | undefined
  >("DeletePermissionGroup", async () => {
    const response = await api.delete("core/permission_group", {
      data: { group_id: id },
    });
    await queryClient.refetchQueries({ queryKey: ["PermissionGroups"] });
    return response.data;
  });

  const DeletePermissionGroupMutate = mutate;
  const DeletePermissionGroupIsLoading = isLoading;
  const DeletePermissionGroupError: any = error;
  const DeletePermissionGroupIsSuccess = isSuccess;
  const DeletePermissionGroupReset = reset;

  return {
    DeletePermissionGroupMutate,
    DeletePermissionGroupReset,
    DeletePermissionGroupIsLoading,
    DeletePermissionGroupError,
    DeletePermissionGroupIsSuccess,
  };
}
