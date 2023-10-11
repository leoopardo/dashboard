/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "react-query";
import { api } from "../../../../config/api";
import { queryClient } from "../../../queryClient";

export function useDeleteMechantBlacklist(  params: {cpf?: string} | null) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    any | null | undefined
  >("DeleteMerchantBlacklist", async () => {
    const response = await api.delete(`blacklist/merchant-black-list`, {params});
    await queryClient.refetchQueries({
      queryKey: ["MerchantBlacklist"],
    });
    return response.data;
  });
  const isDeleteLoading = isLoading;
  const DeleteError = error;
  const mutateDelete = mutate;
  const isDeleteSuccess = isSuccess;
  return {
    isDeleteLoading,
    DeleteError,
    mutateDelete,
    isDeleteSuccess,
  };
}