/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../../../../config/api";
import { useMutation } from "react-query";
import { queryClient } from "../../../queryClient";

export function useCreateWithdrawVoucherRefund(id?: string | null) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    any | null | undefined
  >("GenerateWithdrawalReceipt", async () => {
    const response = await api.post(`create/pdf/withdraw-receipt/${id}`, {}, {});
    await queryClient.refetchQueries({
      queryKey: ["withdraw"],
    });
    return response.data;
  });
  const isWithdrawVoucherLoading = isLoading;
  const WithdrawVoucherError = error;
  const mutateWithdrawVoucher = mutate;
  const isWithdrawVoucherSuccess = isSuccess;
  return {
    isWithdrawVoucherLoading,
    WithdrawVoucherError,
    mutateWithdrawVoucher,
    isWithdrawVoucherSuccess,
  };
}
