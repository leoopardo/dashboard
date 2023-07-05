import { api } from "../../../../config/api";
import { useMutation, } from "react-query";
import { queryClient } from "../../../queryClient";
import { CreateMerchantManualTransaction } from "@src/services/types/moviments/merchant/createManualTransaction.interface";

export function useCreateMerchantManualTransaction(body: CreateMerchantManualTransaction | null) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
  CreateMerchantManualTransaction | null | undefined
  >("createMerchantManualMoviment", async () => {
    const response = await api.post("core/entry-account/create", body, {});
    await queryClient.refetchQueries({ queryKey: ["MerchantMoviments"] });
    return response.data;
  });

  return {
    isLoading,
    error,
    mutate,
    isSuccess,
  };
}
