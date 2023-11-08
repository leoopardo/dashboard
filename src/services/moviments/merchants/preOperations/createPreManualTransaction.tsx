import { CreateMerchantManualTransaction } from "@src/services/types/moviments/merchant/createManualTransaction.interface";
import { useMutation } from "react-query";
import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";

export function useCreatePreManualTransaction(
  body: CreateMerchantManualTransaction | null
) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    CreateMerchantManualTransaction | null | undefined
  >("createPreManualTransaction", async () => {
    const response = await api.post("core/pre-entry-account/create", body, {});
    await queryClient.refetchQueries({ queryKey: ["PreManualEntry"] });
    return response.data;
  });

  return {
    isLoading,
    error,
    mutate,
    isSuccess,
  };
}
