/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { MerchantResponsiblesBody } from "@src/services/types/register/merchants/responsibles/responsibles.interface";
import { useMutation } from "react-query";

export function useCreateMerchantResponsible(
  body: MerchantResponsiblesBody
) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    MerchantResponsiblesBody | null | undefined
  >("CreateMerchantResponsible", async () => {
    const response = await api.post("core/merchant/responsible/create", body, {});
    await queryClient.refetchQueries({ queryKey: ["MerchantResponsibles"] });
    return response.data;
  });

  const MerchantResponsibleMutate = mutate;
  const MerchantResponsibleIsLoading = isLoading;
  const MerchantResponsibleError: any = error;
  const MerchantResponsibleIsSuccess = isSuccess;
  const MerchantResponsibleReset = reset;

  return {
    MerchantResponsibleMutate,
    MerchantResponsibleIsLoading,
    MerchantResponsibleError,
    MerchantResponsibleIsSuccess,
    MerchantResponsibleReset,
  };
}
