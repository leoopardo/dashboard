import { useEffect, useState } from "react";
import { api } from "../../config/api";
import {
  generatedDepositTotal,
  generatedDepositTotalQuery,
} from "../types/generatedDeposits.interface";
import { useQuery } from "react-query";
import moment from "moment";

export function useGetTotalGeneratedDeposits(
  params: generatedDepositTotalQuery
) {
  const { data, isFetching, error, refetch,  } = useQuery<
    generatedDepositTotal | null | undefined
  >(
    "depositsTotal",
    async () => {
      const response = await api.get("report/pix/total", {
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
      return response.data;
    },
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
    }
  );

  const depositsTotal = data;
  const isDepositsTotalFetching = isFetching;
  const depositsTotalError: any = error;
  const refetchDepositsTotal = refetch;

  return {
    depositsTotal,
    isDepositsTotalFetching,
    depositsTotalError,
    refetchDepositsTotal,
  };
}
