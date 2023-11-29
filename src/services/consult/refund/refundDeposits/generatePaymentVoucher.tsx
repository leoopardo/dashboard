/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../../../../config/api";
import { useMutation } from "react-query";
import { queryClient } from "../../../queryClient";

export function useCreateDepositPaymentVoucherRefund(id?: string | null) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    any | null | undefined
  >("GenerateDepositPaymentVoucher", async () => {
    const response = await api.post(`create/pdf/deposit-receipt/auto-refund/${id}`, {}, {});
    await queryClient.refetchQueries({
      queryKey: ["refundOne"],
    });
    return response.data;
  });
  const isDepositPaymentVoucherLoading = isLoading;
  const DepositPaymentVoucherError = error;
  const mutateDepositPaymentVoucher = mutate;
  const isDepositPaymentVoucherSuccess = isSuccess;
  return {
    isDepositPaymentVoucherLoading,
    DepositPaymentVoucherError,
    mutateDepositPaymentVoucher,
    isDepositPaymentVoucherSuccess,
  };
}
