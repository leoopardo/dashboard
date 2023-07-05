import moment from "moment";
import { api } from "../../../../config/api";
import { useQuery } from "react-query";
import {
  DepositsLogsStepsTotalItem,
  DepositsLogsStepsTotalQuery,
} from "@src/services/types/support/apiLogs/depositsError.interface";

export function useGetDepositsErrorsTotal(
  params: DepositsLogsStepsTotalQuery
) {
  const { data, isFetching, error, refetch } = useQuery<
    DepositsLogsStepsTotalItem[] | null | undefined
  >(
    "DepositsErrorsTotal",
    async () => {
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
    },
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
    }
  );

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
