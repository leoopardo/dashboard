/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../../../../config/api";
import { useMutation } from "react-query";
import { queryClient } from "../../../queryClient";

export function usePayRefundToEndUser(transaction_id?: string) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    any | null | undefined
  >("payToEndUserRefund", async () => {
    const response = await api.post(
      `refund/pix/refund/to-end-user`,
      { transaction_id, pix_key: transaction_id },
      {}
    );
    await queryClient.refetchQueries({ queryKey: ["refundRows"] });
    return response.data;
  });
  const PayRefundToEndUserIsLoading = isLoading;
  const PayRefundToEndUsererror = error;
  const PayRefundToEndUserSuccess = isSuccess;
  const PayRefundToEndUserMutate = mutate;

  return {
    PayRefundToEndUserIsLoading,
    PayRefundToEndUsererror,
    PayRefundToEndUserSuccess,
    PayRefundToEndUserMutate,
  };
}
