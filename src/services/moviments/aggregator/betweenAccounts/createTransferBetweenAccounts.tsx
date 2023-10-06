import { AggregatorTransferBetweenAccountsbody } from "@src/services/types/moviments/aggregator/transferBetweenAccounts.interface";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";
import { queryClient } from "../../../queryClient";

export function useCreateAggregatorTransferBetweenAccounts(
  body: AggregatorTransferBetweenAccountsbody | null
) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
  AggregatorTransferBetweenAccountsbody | null | undefined
  >("createAggregatorTransferBetweenAccounts", async () => {
    const response = await api.post("core/aggregator/account/balance/transfer/create", body, {});
    await queryClient.refetchQueries({ queryKey: ["getAggregatorTransferBetweenMerchantAccounts"] });
    return response.data;
  });

  return {
    isLoading,
    error,
    mutate,
    isSuccess,
  };
}
