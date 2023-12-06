/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@src/config/api";

import { useMutation } from "react-query";

export function useCreatePermission(id?: number, body?: number[]) {
  const { isLoading, error, mutate, isSuccess, reset, data } = useMutation<
    any | null | undefined
  >("CreatePermission", async () => {
    const response = await api.post(
      "core/permission/insert",
      { group_id: id, permissions_id: body },
      {}
    );
    return response.data;
  });

  const PermissionMutate = mutate;
  const PermissionIsLoading = isLoading;
  const PermissionError: any = error;
  const PermissionIsSuccess = isSuccess;
  const PermissionReset = reset;

  return {
    PermissionMutate,
    PermissionReset,
    PermissionIsLoading,
    PermissionError,
    PermissionIsSuccess,
    data,
  };
}
