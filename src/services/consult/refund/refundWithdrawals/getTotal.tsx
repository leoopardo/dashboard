/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { refundWithdrawalsQuery } from "@src/services/types/consult/refunds/refundWithdrawals.interface copy";
import { useEffect, useState } from "react";
import { api } from "../../../../config/api";
import { refundDepositTotal } from "../../../types/consult/refunds/refundsDeposits.interface";

export function useGetTotalRefundWithdrawals(params: refundWithdrawalsQuery) {
  const [data, setData] = useState<refundDepositTotal | null>(null);
  const [error, setError] = useState<any>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchTotalWithdrawals = async () => {
    try {
      setIsFetching(true);
      const response = await api.get("refund/withdraw/total", {
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

  const refundWithdrawalsTotal = data;
  const isRefundWithdrawalsTotalFetching = isFetching;
  const refundWithdrawalsTotalError: any = error;
  const refetchRefundWithdrawalsTotal = fetchTotalWithdrawals;

  return {
    refundWithdrawalsTotal,
    isRefundWithdrawalsTotalFetching,
    refundWithdrawalsTotalError,
    refetchRefundWithdrawalsTotal,
  };
}
