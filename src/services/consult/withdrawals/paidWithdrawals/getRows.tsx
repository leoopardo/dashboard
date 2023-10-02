/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../../../../config/api";

import { useQuery } from "react-query";
import {
  paidWithdrawalsRowsQuery,
  paidWithdrawalsRowsResponse,
} from "../../../types/consult/withdrawals/paidWithdrawals.interface";
export function useGetRowsPaidWithdrawals(params: paidWithdrawalsRowsQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    paidWithdrawalsRowsResponse | null | undefined
  >(
    "paidWithdrawalsRows",
    async () => {
      const response = await api.get("report/withdraw/rows/paid-at", {
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

  const paidWithdrawalsRows = data;
  const isPaidWithdrawalsRowsFetching = isFetching;
  const paidWithdrawalsRowsError: any = error;
  const refetchPaidWithdrawalsTotalRows = refetch;
  return {
    paidWithdrawalsRows,
    isPaidWithdrawalsRowsFetching,
    paidWithdrawalsRowsError,
    refetchPaidWithdrawalsTotalRows,
  };
}
