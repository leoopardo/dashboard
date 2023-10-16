/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { MerchantResponsiblesBody } from "@src/services/types/register/merchants/responsibles/responsibles.interface";
import { useMutation } from "react-query";

export function useUpdateMerchantResponsible(
  body: MerchantResponsiblesBody
) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    MerchantResponsiblesBody | null | undefined
  >("UpdateMerchantResponsible", async () => {
    const response = await api.put("core/merchant/responsible/update", body, {});
    await queryClient.refetchQueries({ queryKey: ["MerchantResponsibles"] });
    return response.data;
  });

  const UpdateMerchantResponsibleMutate = mutate;
  const UpdateMerchantResponsibleIsLoading = isLoading;
  const UpdateMerchantResponsibleError: any = error;
  const UpdateMerchantResponsibleIsSuccess = isSuccess;
  const UpdateMerchantResponsibleReset = reset;

  return {
    UpdateMerchantResponsibleMutate,
    UpdateMerchantResponsibleIsLoading,
    UpdateMerchantResponsibleError,
    UpdateMerchantResponsibleIsSuccess,
    UpdateMerchantResponsibleReset,
  };
}
