/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { api } from "../../../../config/api";
import {
  generatedWithdrawalsRowsQuery,
  generatedWithdrawalsTotal,
} from "../../../types/consult/withdrawals/generatedWithdrawals.interface";

export function useGetTotalGeneratedWithdrawals(
  params: generatedWithdrawalsRowsQuery
) {
  const [data, setData] = useState<generatedWithdrawalsTotal | null>(null);
  const [error, setError] = useState<any>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchTotalWithdrawals = async () => {
    try {
      setIsFetching(true);
      const response = await api.get("report/withdraw/total", {
        params,
      });
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchTotalWithdrawals();
  }, [params]);

  const WithdrawalsTotal = data;
  const isWithdrawalsTotalFetching = isFetching;
  const WithdrawalsTotalError: any = error;
  const refetchWithdrawalsTotal = fetchTotalWithdrawals;

  return {
    WithdrawalsTotal,
    isWithdrawalsTotalFetching,
    WithdrawalsTotalError,
    refetchWithdrawalsTotal,
  };
}
