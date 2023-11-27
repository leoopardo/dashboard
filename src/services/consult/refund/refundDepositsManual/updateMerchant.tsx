/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "react-query";
import { api } from "../../../../config/api";
import { queryClient } from "../../../queryClient";
import { UpdateMerchantRefundBody } from "@src/services/types/consult/refunds/refundmanualDeposits.interface";

export function useUpdateMerchantRefund(body: UpdateMerchantRefundBody) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    any | null | undefined
  >("UpdateMerchantRefund", async () => {
    const response = await api.put(
      `refund/pix-manual/merchant/update`,
      body,
      {}
    );
    await queryClient.refetchQueries({
      queryKey: ["RefundManualDepositsManual"],
    });
    return response.data;
  });
  const isUpdateMerchantLoading = isLoading;
  const UpdateMerchantError = error;
  const mutateUpdateMerchant = mutate;
  const isUpdateMerchantSuccess = isSuccess;
  return {
    isUpdateMerchantLoading,
    UpdateMerchantError,
    mutateUpdateMerchant,
    isUpdateMerchantSuccess,
  };
}
