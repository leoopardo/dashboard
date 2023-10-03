import { useEffect, useState } from "react";
import { api } from "../../../../config/api";
import { refundManualDepositsQuery } from "../../../types/consult/refunds/refundmanualDeposits.interface";
import { refundDepositTotal } from "../../../types/consult/refunds/refundsDeposits.interface";

export function useGetTotalRefundDepositManual(params: refundManualDepositsQuery) {
  const [data, setData] = useState<refundDepositTotal | null>(null);
  const [error, setError] = useState<any>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchTotalDepositManual = async () => {
    try {
      setIsFetching(true);
      const response = await api.get("refund/pix-manual/total", {
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
    fetchTotalDepositManual();
  }, [params]);

  const refundDepositManualTotal = data;
  const isRefundDepositManualTotalFetching = isFetching;
  const refundDepositManualTotalError: any = error;
  const refetchRefundDepositManualTotal = fetchTotalDepositManual;

  return {
    refundDepositManualTotal,
    isRefundDepositManualTotalFetching,
    refundDepositManualTotalError,
    refetchRefundDepositManualTotal,
  };
}
