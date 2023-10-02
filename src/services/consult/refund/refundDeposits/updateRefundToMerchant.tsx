/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../../../../config/api";
import { useMutation } from "react-query";
import { queryClient } from "../../../queryClient";

export function useUpatePayToMerchant(id?: string | null) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    any | null | undefined
  >("UpdaterefundToMerchant", async () => {
    const response = await api.put(
      `refund/pix/refund/paid_to_merchant/${id}`,
      {},
      {}
    );
    await queryClient.refetchQueries({ queryKey: ["refundRows"] });
    return response.data;
  });
  const payToMerchantIsLoading = isLoading;
  const payToMerchanterror = error;
  const payToMerchantSuccess = isSuccess;
  const payToMerchantMutate = mutate;

  return {
    payToMerchantIsLoading,
    payToMerchanterror,
    payToMerchantSuccess,
    payToMerchantMutate,
  };
}
