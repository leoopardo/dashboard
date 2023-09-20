/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { api } from "../../../../config/api";
import {
  paidWithdrawalsRowsQuery,
  paidWithdrawalsTotal,
} from "../../../types/consult/withdrawals/paidWithdrawals.interface";

export function useGetTotalPaidWithdrawals(params: paidWithdrawalsRowsQuery) {
  const [data, setData] = useState<paidWithdrawalsTotal | null>(null);
  const [error, setError] = useState<any>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchTotalWithdrawals = async () => {
    try {
      setIsFetching(true);
      const response = await api.get("report/withdraw/total/paid-at", {
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

  const PaidWithdrawalsTotal = data;
  const isPaidWithdrawalsTotalFetching = isFetching;
  const PaidWithdrawalsTotalError: any = error;
  const refetchPaidWithdrawalsTotal = fetchTotalWithdrawals;

  return {
    PaidWithdrawalsTotal,
    isPaidWithdrawalsTotalFetching,
    PaidWithdrawalsTotalError,
    refetchPaidWithdrawalsTotal,
  };
}
