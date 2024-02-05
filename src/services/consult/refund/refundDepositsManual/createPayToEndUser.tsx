/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../../../../config/api";
import { useMutation } from "react-query";
import { queryClient } from "../../../queryClient";

export function useCreatePayToEndUserRefund(id?: string | null) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    any | null | undefined
  >("CreatePayToEndUserRefund", async () => {
    const response = await api.post(`refund/pix-manual/refund_to_enduser/${id}`, {}, {});
    await queryClient.refetchQueries({
      queryKey: ["RefundManualDepositsManual"],
    });
    return response.data;
  });
  const isPayToEndUserLoading = isLoading;
  const PayToEndUserError = error;
  const mutatePayToEndUser = mutate;
  const isPayToEndUserSuccess = isSuccess;
  return {
    isPayToEndUserLoading,
    PayToEndUserError,
    mutatePayToEndUser,
    isPayToEndUserSuccess,
  };
}
