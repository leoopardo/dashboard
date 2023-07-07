import moment from "moment";
import { api } from "../../../../config/api";
import { useQuery } from "react-query";
import { DepositLogsItem, DepositsLogsStepsTotalQuery } from "@src/services/types/support/apiLogs/depositsError.interface";


export function useGetWithdrawalsErrorsLogs(
  params: DepositsLogsStepsTotalQuery
) {
  const { data, isFetching, error, refetch } = useQuery<
  DepositLogsItem[] | null | undefined
  >(
    "WithdrawalsErrorsLogs",
    async () => {
      const response = await api.get("report/logs/withdraw", {
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
  );

  const WithdrawalsErrorsLogs = data;
  const isWithdrawalsErrorsLogsFetching = isFetching;
  const WithdrawalsErrorsLogsError: any = error;
  const refetchWithdrawalsErrorsLogs = refetch;
  return {
    WithdrawalsErrorsLogs,
    isWithdrawalsErrorsLogsFetching,
    WithdrawalsErrorsLogsError,
    refetchWithdrawalsErrorsLogs,
  };
}