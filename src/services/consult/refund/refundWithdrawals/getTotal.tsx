/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { refundWithdrawalsQuery } from "@src/services/types/consult/refunds/refundWithdrawals.interface";
import { api } from "../../../../config/api";
import { refundDepositTotal } from "../../../types/consult/refunds/refundsDeposits.interface";
import { useQuery } from "react-query";

export function useGetTotalRefundWithdrawals(params: refundWithdrawalsQuery) {
  const { data, isFetching, error, refetch } = useQuery<
  refundDepositTotal | null | undefined
  >(
    "refundWithdrawTotal",
    async () => {
      const response = await api.get("refund/withdraw/total", {
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

  const refundWithdrawalsTotal = error ? ({} as refundDepositTotal) : data;
  const isRefundWithdrawalsTotalFetching = isFetching;
  const refundWithdrawalsTotalError: any = error;
  const refetchRefundWithdrawalsTotal = refetch;

  return {
    refundWithdrawalsTotal,
    isRefundWithdrawalsTotalFetching,
    refundWithdrawalsTotalError,
    refetchRefundWithdrawalsTotal,
  };
}
