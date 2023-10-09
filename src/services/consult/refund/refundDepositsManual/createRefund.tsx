/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../../../../config/api";
import { useMutation } from "react-query";
import { queryClient } from "../../../queryClient";

export function useCreatePixManualRefund(id?: string | null) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    any | null | undefined
  >("CreatePixManualRefund", async () => {
    const response = await api.post(`refund/pix-manual/${id}`, {}, {});
    await queryClient.refetchQueries({ queryKey: ["RefundManualDepositsManual"] });
    return response.data;
  });

  return {
    isLoading,
    error,
    mutate,
    isSuccess,
  };
}
