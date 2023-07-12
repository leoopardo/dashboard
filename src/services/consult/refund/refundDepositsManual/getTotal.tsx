import { useEffect, useState } from "react";
import { api } from "../../../../config/api";
import moment from "moment";
import { refundWithdrawalsQuery } from "../../../types/consult/refunds/refundWithdrawals.interface";
import { refundDepositTotal } from "../../../types/consult/refunds/refundsDeposits.interface";

export function useGetTotalRefundDepositManual(params: refundWithdrawalsQuery) {
  const [data, setData] = useState<refundDepositTotal | null>(null);
  const [error, setError] = useState<any>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchTotalDepositManual = async () => {
    try {
      setIsFetching(true);
      const response = await api.get("refund/pix/total", {
        params: {
          ...params,
          start_date: moment(params.start_date)
            .add(3, "hours")
            .format("YYYY-MM-DDTHH:mm:ss.SSS"),
          end_date: moment(params.end_date)
            .add(3, "hours")
            .format("YYYY-MM-DDTHH:mm:ss.SSS"),
        },
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
