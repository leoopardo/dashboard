import { useEffect, useState } from "react";
import { api } from "../../../../config/api";
import moment from "moment";
import {
  refundDepositTotal,
  refundDepositsQuery,
} from "../../../types/consult/refunds/refundsDeposits.interface";

export function useGetTotalRefundDeposits(params: refundDepositsQuery) {
  const [data, setData] = useState<refundDepositTotal | null>(null);
  const [error, setError] = useState<any>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchTotalDeposits = async () => {
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
    fetchTotalDeposits();
  }, [params]);

  const refundDepositsTotal = data;
  const isRefundDepositsTotalFetching = isFetching;
  const refundDepositsTotalError: any = error;
  const refetchRefundDepositsTotal = fetchTotalDeposits;

  return {
    refundDepositsTotal,
    isRefundDepositsTotalFetching,
    refundDepositsTotalError,
    refetchRefundDepositsTotal,
  };
}
