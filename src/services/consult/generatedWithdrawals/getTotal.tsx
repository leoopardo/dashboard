import { useEffect, useState } from "react";
import { api } from "../../../config/api";

import { useQuery } from "react-query";
import moment from "moment";
import {
  generatedWithdrawalsRowsQuery,
  generatedWithdrawalsTotal,
} from "../../types/consult/withdrawals/generatedWithdrawals.interface";

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
