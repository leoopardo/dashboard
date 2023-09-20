/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "react-query";
import { api } from "../../../../config/api";
import {
  generatedWithdrawalsRowsQuery,
  generatedWithdrawalsRowsResponse,
} from "../../../types/consult/withdrawals/generatedWithdrawals.interface";

export function useGetRowsGeneratedWithdrawals(
  params: generatedWithdrawalsRowsQuery
) {
  const { data, isFetching, error, refetch } = useQuery<
    generatedWithdrawalsRowsResponse | null | undefined
  >(
    "witrawalsRows",
    async () => {
      const response = await api.get("report/withdraw/rows", {
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

  const witrawalsRows = data;
  const isWithdrawalsRowsFetching = isFetching;
  const witrawalsRowsError: any = error;
  const refetchWithdrawalsTotalRows = refetch;
  return {
    witrawalsRows,
    isWithdrawalsRowsFetching,
    witrawalsRowsError,
    refetchWithdrawalsTotalRows,
  };
}
