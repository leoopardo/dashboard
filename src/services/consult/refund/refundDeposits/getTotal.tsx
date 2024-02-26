/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../../../../config/api";
import {
  refundDepositTotal,
  refundDepositsQuery,
} from "../../../types/consult/refunds/refundsDeposits.interface";
import { useQuery } from "react-query";

export function useGetTotalRefundDeposits(params: refundDepositsQuery) {
  const { data, isFetching, error, refetch } = useQuery<
  refundDepositTotal | null | undefined
  >(
    "refundDepositsTotal",
    async () => {
      const response = await api.get("refund/pix/total", {
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

  const refundDepositsTotal = error ? ({} as refundDepositTotal) : data;
  const isRefundDepositsTotalFetching = isFetching;
  const refundDepositsTotalError: any = error;
  const refetchRefundDepositsTotal = refetch;

  return {
    refundDepositsTotal,
    isRefundDepositsTotalFetching,
    refundDepositsTotalError,
    refetchRefundDepositsTotal,
  };
}
