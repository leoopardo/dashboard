/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../../../../config/api";
import { useMutation } from "react-query";
import { queryClient } from "../../../queryClient";

export function useCreatePayToMerchantRefund(id?: string | null) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    any | null | undefined
  >("CreatePayToMerchantRefund", async () => {
    const response = await api.post(`refund/pix-manual/refund_to_merchant/${id}`, {}, {});
    await queryClient.refetchQueries({
      queryKey: ["RefundManualDepositsManual"],
    });
    return response.data;
  });
  const isPayToMerchantLoading = isLoading;
  const PayToMerchantError = error;
  const mutatePayToMerchant = mutate;
  const isPayToMerchantSuccess = isSuccess;
  return {
    isPayToMerchantLoading,
    PayToMerchantError,
    mutatePayToMerchant,
    isPayToMerchantSuccess,
  };
}
