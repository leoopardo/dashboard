import {
  DepositLogsData,
  DepositsLogsStepsTotalQuery,
} from "@src/services/types/support/apiLogs/depositsError.interface";
import moment from "moment";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetDepositsErrorsLogs(params: DepositsLogsStepsTotalQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    DepositLogsData | null | undefined
  >("DepositsErrorsLogs", async () => {
    const response = await api.get("report/logs/deposit", {
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
