/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../../../../config/api";
import {
  paidWithdrawalsRowsQuery,
  paidWithdrawalsTotal,
} from "../../../types/consult/withdrawals/paidWithdrawals.interface";
import { useQuery } from "react-query";

export function useGetTotalPaidWithdrawals(params: paidWithdrawalsRowsQuery) {
  const { data, isFetching, error, refetch } = useQuery<
  paidWithdrawalsTotal | null | undefined
  >(
    "withdrawPaidTotal",
    async () => {
      const response = await api.get("report/withdraw/total/paid-at", {
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
  const PaidWithdrawalsTotal = error ? ({} as paidWithdrawalsTotal) : data;
  const isPaidWithdrawalsTotalFetching = isFetching;
  const PaidWithdrawalsTotalError: any = error;
  const refetchPaidWithdrawalsTotal = refetch;

  return {
    PaidWithdrawalsTotal,
    isPaidWithdrawalsTotalFetching,
    PaidWithdrawalsTotalError,
    refetchPaidWithdrawalsTotal,
  };
}
