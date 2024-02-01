/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { useMutation } from "react-query";

export function useDeleteLicense(body?: { license_id?: number }) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    { id?: number } | null | undefined
  >("deleteLicense", async () => {
    const response = await api.delete("core/license/delete", {
      data: body,
    });
    await queryClient.refetchQueries({ queryKey: ["Licenses"] });
    return response.data;
  });

  const deleteLicenseMutate = mutate;
  const deleteLicenseIsLoading = isLoading;
  const deleteLicenseError: any = error;
  const deleteLicenseIsSuccess = isSuccess;

  return {
    deleteLicenseMutate,
    deleteLicenseIsLoading,
    deleteLicenseError,
    deleteLicenseIsSuccess,
  };
}
