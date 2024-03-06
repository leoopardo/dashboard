/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DepositsLogsStepsTotalItem,
  DepositsLogsStepsTotalQuery,
} from "@src/services/types/support/apiLogs/depositsError.interface";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetDepositsErrorsTotal(params: DepositsLogsStepsTotalQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    DepositsLogsStepsTotalItem[] | null | undefined
  >("DepositsErrorsTotal", async () => {
    const response = await api.get("report/logs/deposit/steps/total", {
      params,
    });
    return response.data;
  });

  const DepositsErrorsTotal = error ? undefined : data;
  const isDepositsErrorsTotalFetching = isFetching;
  const DepositsErrorsTotalError: any = error;
  const refetchDepositsErrorsTotal = refetch;
  return {
    DepositsErrorsTotal,
    isDepositsErrorsTotalFetching,
    DepositsErrorsTotalError,
    refetchDepositsErrorsTotal,
  };
}
