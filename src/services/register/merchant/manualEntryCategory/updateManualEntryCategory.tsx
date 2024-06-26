import { api } from "@config/api";
import { queryClient } from "@services/queryClient";
import { MerchantManualEntryCategoryItem } from "@src/services/types/register/merchants/merchantManualEntryCategory.interface";
import { useMutation } from "react-query";

export function useUpdateManualEntryCategory(
  body: MerchantManualEntryCategoryItem | null
) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    MerchantManualEntryCategoryItem | null | undefined
  >("UpdateMerchantManualEntryCategory", async () => {
    const response = await api.put(
      "core/entry-account/update/category",
      body,
      {}
    );
    await queryClient.refetchQueries({
      queryKey: ["MerchantManualEntryCategory"],
    });
    return response.data;
  });

  const updateMutate = mutate;
  const updateIsLoading = isLoading;
  const updateError = error;
  const updateIsSuccess = isSuccess;

  return {
    updateMutate,
    updateIsLoading,
    updateError,
    updateIsSuccess,
  };
}
