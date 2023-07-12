/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryClient } from "@src/services/queryClient";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";

export function useCreateBankBlacklist(body: {
  bank_name: string;
  ispb: string;
}) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    { bank_name: string; ispb: string } | null | undefined
  >("CreateBankBlacklist", async () => {
    const response = await api.post("blacklist/bank-black-list", body, {});
    await queryClient.refetchQueries({ queryKey: ["BankBlacklist"] });
    return response.data;
  });

  const CreateMutate = mutate;
  const CreateIsLoading = isLoading;
  const CreateError: any = error;
  const CreateIsSuccess = isSuccess;

  return {
    CreateMutate,
    CreateIsLoading,
    CreateError,
    CreateIsSuccess,
  };
}
