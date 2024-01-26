/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../../../../config/api";
import { refundManualDepositsQuery } from "../../../types/consult/refunds/refundmanualDeposits.interface";
import { refundDepositTotal } from "../../../types/consult/refunds/refundsDeposits.interface";
import { useQuery } from "react-query";

export function useGetTotalRefundDepositManual(params: refundManualDepositsQuery) {
  const { data, isFetching, error, refetch } = useQuery<
  refundDepositTotal | null | undefined
  >(
    "refundDepositManualTotal",
    async () => {
      const response = await api.get("refund/pix-manual/total", {
        params,
      });
      return response.data;
    },
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const refundDepositManualTotal = data;
  const isRefundDepositManualTotalFetching = isFetching;
  const refundDepositManualTotalError: any = error;
  const refetchRefundDepositManualTotal = refetch;

  return {
    refundDepositManualTotal,
    isRefundDepositManualTotalFetching,
    refundDepositManualTotalError,
    refetchRefundDepositManualTotal,
  };
}
