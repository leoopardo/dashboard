import { useMutation } from "react-query";
import { api } from "../../../../config/api";
import { queryClient } from "../../../queryClient";

export function useCheckPayment(body: {txid: string}) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    {txid: string} | null | undefined
  >("depositsRows", async () => {
    const response = await api.post("reconciliation/pix/pix/txid", body, {});
    await queryClient.refetchQueries({ queryKey: ["checkPayment"] });
    return response.data;
  });


  const isCheckPaymentFetching = isLoading;
  const checkPaymentError: any = error;
  const checkPaymentSuccess: any = isSuccess;
  const refetchCheckPayment = mutate;

  return {
    isCheckPaymentFetching,
    checkPaymentError,
    refetchCheckPayment,
    checkPaymentSuccess,
  };
}
