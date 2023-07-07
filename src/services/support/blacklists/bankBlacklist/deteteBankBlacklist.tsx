import { queryClient } from "@src/services/queryClient";
import { api } from "../../../../config/api";
import { useMutation } from "react-query";

export function useDeleteBankBlacklist(params: { ispb?: string }) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    { bank_name: string; ispb: string } | null | undefined
  >("DeleteBankBlacklist", async () => {
    const response = await api.delete("blacklist/bank-black-list", { params });
    await queryClient.refetchQueries({ queryKey: ["BankBlacklist"] });
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