/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment";
import { useEffect, useState } from "react";
import { api } from "../../../../config/api";
import {
  generatedDepositTotal,
  generatedDepositTotalQuery,
} from "../../../types/consult/deposits/generatedDeposits.interface";

export function useGetTotalGeneratedDeposits(
  params: generatedDepositTotalQuery
) {
  const [data, setData] = useState<generatedDepositTotal | null>(null);
  const [error, setError] = useState<any>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchTotalDeposits = async () => {
    try {
      setIsFetching(true);
      const response = await api.get("report/pix/total", {
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
    fetchTotalDeposits();
  }, [params]);

  const depositsTotal = data;
  const isDepositsTotalFetching = isFetching;
  const depositsTotalError: any = error;
  const refetchDepositsTotal = fetchTotalDeposits;

  return {
    depositsTotal,
    isDepositsTotalFetching,
    depositsTotalError,
    refetchDepositsTotal,
  };
}
