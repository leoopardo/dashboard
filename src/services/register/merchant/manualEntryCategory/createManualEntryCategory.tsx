import { api } from "../../../../config/api";

import { MerchantManualEntryCategoryItem } from "@src/services/types/register/merchants/merchantManualEntryCategory.interface";
import { useMutation } from "react-query";
import { queryClient } from "../../../queryClient";

export function useCreateManualEntryCategory(
  body: MerchantManualEntryCategoryItem | null
) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    MerchantManualEntryCategoryItem | null | undefined
  >("CreateMerchantManualEntryCategory", async () => {
    const response = await api.post(
      "core/entry-account/create/category",
      body,
      {}
    );
    await queryClient.refetchQueries({
      queryKey: ["MerchantManualEntryCategory"],
    });
    return response.data;
  });

  return {
    isLoading,
    error,
    mutate,
    isSuccess,
  };
}
