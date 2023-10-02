/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DepositLogsData,
  DepositsLogsStepsTotalQuery,
} from "@src/services/types/support/apiLogs/depositsError.interface";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetDepositsErrorsLogs(params: DepositsLogsStepsTotalQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    DepositLogsData | null | undefined
  >("DepositsErrorsLogs", async () => {
    const response = await api.get("report/logs/deposit", {
      params,
    });
    return response.data;
  });

  const DepositsErrorsLogs = data;
  const isDepositsErrorsLogsFetching = isFetching;
  const DepositsErrorsLogsError: any = error;
  const refetchDepositsErrorsLogs = refetch;
  return {
    DepositsErrorsLogs,
    isDepositsErrorsLogsFetching,
    DepositsErrorsLogsError,
    refetchDepositsErrorsLogs,
  };
}
