import moment from "moment";
import { api } from "../../../../config/api";
import { useQuery } from "react-query";
import { DepositLogsItem, DepositsLogsStepsTotalQuery } from "@src/services/types/support/apiLogs/depositsError.interface";


export function useGetDepositsErrorsLogs(
  params: DepositsLogsStepsTotalQuery
) {
  const { data, isFetching, error, refetch } = useQuery<
  DepositLogsItem[] | null | undefined
  >(
    "DepositsErrorsLogs",
    async () => {
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
    },
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
    }
  );

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
