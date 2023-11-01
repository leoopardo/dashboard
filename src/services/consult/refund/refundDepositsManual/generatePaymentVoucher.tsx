/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../../../../config/api";
import { useMutation } from "react-query";
import { queryClient } from "../../../queryClient";

export function useCreatePaymentVoucherRefund(id?: string | null) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    any | null | undefined
  >("GeneratePaymentVoucher", async () => {
    const response = await api.post(`create/pdf/deposit-receipt/manual-refund/${id}`, {}, {});
    await queryClient.refetchQueries({
      queryKey: ["refundManualOne"],
    });
    return response.data;
  });
  const isPaymentVoucherLoading = isLoading;
  const PaymentVoucherError = error;
  const mutatePaymentVoucher = mutate;
  const isPaymentVoucherSuccess = isSuccess;
  return {
    isPaymentVoucherLoading,
    PaymentVoucherError,
    mutatePaymentVoucher,
    isPaymentVoucherSuccess,
  };
}
