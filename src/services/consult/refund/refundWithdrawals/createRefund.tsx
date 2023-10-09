/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../../../../config/api";
import { useMutation } from "react-query";
import { queryClient } from "../../../queryClient";

export function useCreateWithdrawrefund(id?: string | null) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    any | null | undefined
  >("CreateWithdrawRefund", async () => {
    const response = await api.post(`refund/withdraw/refund/${id}`, {}, {});
    await queryClient.refetchQueries({ queryKey: ["refundWithdrawalsRows"] });
    return response.data;
  });

  return {
    isLoading,
    error,
    mutate,
    isSuccess,
  };
}
