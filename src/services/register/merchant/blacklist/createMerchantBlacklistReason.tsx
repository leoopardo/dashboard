import { api } from "../../../../config/api";

import {
  CreateMerchantBlacklistReasons,
  MerchantBlacklistReasonsItem,
} from "@src/services/types/register/merchants/merchantBlacklistReasons.interface";
import { useMutation } from "react-query";
import { queryClient } from "../../../queryClient";

export function useCreateMerchantBlacklistReason(
  body: CreateMerchantBlacklistReasons | null
) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    MerchantBlacklistReasonsItem | null | undefined
  >("CreateMerchantBlacklistReason", async () => {
    const response = await api.post(
      "blacklist/merchant-black-list/reasons",
      body,
      {}
    );
    await queryClient.refetchQueries({ queryKey: ["MerchantBlacklistReason"] });
    return response.data;
  });

  return {
    isLoading,
    error,
    mutate,
    isSuccess,
  };
}
