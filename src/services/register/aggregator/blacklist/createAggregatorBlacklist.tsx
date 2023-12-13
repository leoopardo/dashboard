import { api } from "../../../../config/api";
import { MerchantBlacklistItem } from "@src/services/types/register/merchants/merchantBlacklist.interface";
import { useMutation } from "react-query";
import { queryClient } from "../../../queryClient";

export function useCreateAggregatorBlacklist(body: MerchantBlacklistItem | null) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    MerchantBlacklistItem | null | undefined
  >("CreateAggregatorBlacklist", async () => {
    const response = await api.post("blacklist/aggregator-black-list", body, {});
    await queryClient.refetchQueries({ queryKey: ["AggregatorBlacklist"] });
    return response.data;
  });

  return {
    isLoading,
    error,
    mutate,
    isSuccess,reset
  };
}
