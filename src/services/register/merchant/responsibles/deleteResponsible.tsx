/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { useMutation } from "react-query";

export function useDeleteMerchantResponsible(body: {
  merchant_responsible_id?: number;
}) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    { merchant_responsible_id?: number } | null | undefined
  >("DeleteMerchantResponsible", async () => {
    const response = await api.delete("core/merchant/responsible/delete", {
      data: body,
    });
    await queryClient.refetchQueries({ queryKey: ["MerchantResponsibles"] });
    return response.data;
  });

  const DeleteMerchantResponsibleMutate = mutate;
  const DeleteMerchantResponsibleIsLoading = isLoading;
  const DeleteMerchantResponsibleError: any = error;
  const DeleteMerchantResponsibleIsSuccess = isSuccess;
  const DeleteMerchantResponsibleReset = reset;

  return {
    DeleteMerchantResponsibleMutate,
    DeleteMerchantResponsibleIsLoading,
    DeleteMerchantResponsibleError,
    DeleteMerchantResponsibleIsSuccess,
    DeleteMerchantResponsibleReset,
  };
}
