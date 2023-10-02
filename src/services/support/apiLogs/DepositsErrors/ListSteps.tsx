/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DepositsLogsStepsTotalQuery,
  LogsStepsItem,
} from "@src/services/types/support/apiLogs/depositsError.interface";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetLogsSteps(params: DepositsLogsStepsTotalQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    LogsStepsItem[] | null | undefined
  >("ListSteps", async () => {
    const response = await api.get("report/logs/deposit/steps", {
      params
    });
    return response.data;
  });

  const LogsSteps = data;
  const isLogsStepsFetching = isFetching;
  const LogsStepsError: any = error;
  const refetchLogsSteps = refetch;
  return {
    LogsSteps,
    isLogsStepsFetching,
    LogsStepsError,
    refetchLogsSteps,
  };
}
