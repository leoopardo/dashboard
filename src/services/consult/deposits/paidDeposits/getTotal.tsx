import { useEffect, useState } from "react";
import { api } from "../../../../config/api";
import moment from "moment";
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
        params: {
          ...params,
          initial_date: params.initial_date
            ? moment(params.initial_date)
                .add(3, "hours")
                .format("YYYY-MM-DDTHH:mm:ss.SSS")
            : null,
          final_date: params.final_date
            ? moment(params.final_date)
                .add(3, "hours")
                .format("YYYY-MM-DDTHH:mm:ss.SSS")
            : null,
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
