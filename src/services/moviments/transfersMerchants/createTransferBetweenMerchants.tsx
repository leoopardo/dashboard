import { useMutation } from "react-query";
import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { CreateTransferBetweenMerchants } from "@src/services/types/moviments/transfersMerchants/createTransferBetweenMerchants.interface";

export function useCreateTransferBetweenMerchants(
  body: CreateTransferBetweenMerchants | null
) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    CreateTransferBetweenMerchants | null | undefined
  >("createMerchantManualMoviment", async () => {
    const response = await api.post(
      "core/merchant/balance/transfer/between-merchants/create",
      body,
      {}
    );
    await queryClient.refetchQueries({ queryKey: ["BetweenMerchantsMoviments"] });
    return response.data;
  });

  return {
    isLoading,
    error,
    mutate,
    isSuccess,
  };
}
