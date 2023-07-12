/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DepositsLogsStepsTotalItem,
  DepositsLogsStepsTotalQuery,
} from "@src/services/types/support/apiLogs/depositsError.interface";
import moment from "moment";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetDepositsErrorsTotal(params: DepositsLogsStepsTotalQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    DepositsLogsStepsTotalItem[] | null | undefined
  >("DepositsErrorsTotal", async () => {
    const response = await api.get("report/logs/deposit/steps/total", {
      params: {
        ...params,
        start_date: params.start_date
          ? moment(params.start_date)
              .add(3, "hours")
              .format("YYYY-MM-DDTHH:mm:ss.SSS")
          : null,
        end_date: params.end_date
          ? moment(params.end_date)
              .add(3, "hours")
              .format("YYYY-MM-DDTHH:mm:ss.SSS")
          : null,
      },
    });
    return response.data;
  });

  const DepositsErrorsTotal = data;
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
