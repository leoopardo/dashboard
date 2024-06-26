/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DepositsLogsStepsTotalQuery,
  LogsStepsItem,
} from "@src/services/types/support/apiLogs/depositsError.interface";
import moment from "moment";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetWithdrawLogsSteps(params: DepositsLogsStepsTotalQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    LogsStepsItem[] | null | undefined
  >("ListSteps", async () => {
    const response = await api.get("report/logs/withdraw/steps", {
      params: {
        ...params,
        start_date: params.start_date
          ? moment(params.start_date)
              .utc()
              .format("YYYY-MM-DDTHH:mm:ss.SSS")
          : null,
        end_date: params.end_date
          ? moment(params.end_date)
              .utc()
              .format("YYYY-MM-DDTHH:mm:ss.SSS")
          : null,
      },
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
