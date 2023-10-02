/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { api } from "../../../../config/api";
import {
  paidDepositRowsQuery,
  paidDepositTotal,
} from "../../../types/consult/deposits/PaidDeposits.interface";

export function useGetTotalPaidDeposits(params: paidDepositRowsQuery) {
  const [data, setData] = useState<paidDepositTotal | null>(null);
  const [error, setError] = useState<any>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchPaidTotal = async () => {
    try {
      setIsFetching(true);
      const response = await api.get("report/pix/total/paid-at", {
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
    fetchPaidTotal();
  }, [params]);

  const paidTotal = data;
  const isPaidTotalFetching = isFetching;
  const paidTotalError: any = error;
  const refetchPaidTotal = fetchPaidTotal;

  return {
    paidTotal,
    isPaidTotalFetching,
    paidTotalError,
    refetchPaidTotal,
  };
}
