/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../../../../config/api";
import {
  generatedWithdrawalsRowsQuery,
  generatedWithdrawalsTotal,
} from "../../../types/consult/withdrawals/generatedWithdrawals.interface";
import { useQuery } from "react-query";

export function useGetTotalGeneratedWithdrawals(
  params: generatedWithdrawalsRowsQuery
) {
  const { data, isFetching, error, refetch } = useQuery<
  generatedWithdrawalsTotal | null | undefined
  >(
    "withdrawTotal",
    async () => {
      const response = await api.get("report/withdraw/total", {
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


  const WithdrawalsTotal = error ? ({} as generatedWithdrawalsTotal) : data;
  const isWithdrawalsTotalFetching = isFetching;
  const WithdrawalsTotalError: any = error;
  const refetchWithdrawalsTotal = refetch;

  return {
    WithdrawalsTotal,
    isWithdrawalsTotalFetching,
    WithdrawalsTotalError,
    refetchWithdrawalsTotal,
  };
}
