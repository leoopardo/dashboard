import { api } from "../../../../config/api";

import { MerchantBlacklistItem } from "@src/services/types/register/merchants/merchantBlacklist.interface";
import { useMutation } from "react-query";
import { queryClient } from "../../../queryClient";

export function useCreateMerchantBlacklist(body: MerchantBlacklistItem | null) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    MerchantBlacklistItem | null | undefined
  >("CreateMerchantUserr", async () => {
    const response = await api.post("blacklist/merchant-black-list", body, {});
    await queryClient.refetchQueries({ queryKey: ["MerchantBlacklist"] });
    return response.data;
  });

  return {
    isLoading,
    error,
    mutate,
    isSuccess,
  };
}
