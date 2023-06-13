import { useEffect, useState } from "react";
import { api } from "../../config/api";
import moment from "moment";
import {
  paidWithdrawalsRowsQuery,
  paidWithdrawalsTotal,
} from "../types/paidWithdrawals";

export function useGetTotalPaidWithdrawals(params: paidWithdrawalsRowsQuery) {
  const [data, setData] = useState<paidWithdrawalsTotal | null>(null);
  const [error, setError] = useState<any>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchTotalWithdrawals = async () => {
    try {
      setIsFetching(true);
      const response = await api.get("report/withdraw/total/paid-at", {
        params: {
          ...params,
          initial_date: moment(params.initial_date)
            .add(3, "hours")
            .format("YYYY-MM-DDTHH:mm:ss.SSS"),
          final_date: moment(params.final_date)
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
