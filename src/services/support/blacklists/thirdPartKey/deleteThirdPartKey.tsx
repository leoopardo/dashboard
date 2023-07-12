/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryClient } from "@src/services/queryClient";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";

export function useDeleteThirdPartKey(params: { id?: string }) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    { bank_name: string; ispb: string } | null | undefined
  >("DeleteThirdPartKey", async () => {
    const response = await api.delete("blacklist/pix-key-from-another-owner", {
      params,
    });
    await queryClient.refetchQueries({ queryKey: ["ThirdPartKey"] });
    return response.data;
  });

  const DeleteMutate = mutate;
  const DeleteIsLoading = isLoading;
  const DeleteError: any = error;
  const DeleteIsSuccess = isSuccess;

  return {
    DeleteMutate,
    DeleteIsLoading,
    DeleteError,
    DeleteIsSuccess,
  };
}
