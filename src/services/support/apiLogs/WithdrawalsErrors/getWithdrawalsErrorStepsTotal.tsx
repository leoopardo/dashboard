import {
  DepositsLogsStepsTotalItem,
  DepositsLogsStepsTotalQuery,
} from "@src/services/types/support/apiLogs/depositsError.interface";
import moment from "moment";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetWithdrawalsErrorsTotal(
  params: DepositsLogsStepsTotalQuery
) {
  const { data, isFetching, error, refetch } = useQuery<
    DepositsLogsStepsTotalItem[] | null | undefined
  >("WithdrawalsErrorsTotal", async () => {
    const response = await api.get("report/logs/withdraw/steps/total", {
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

  const WithdrawalsErrorsTotal = data;
  const isWithdrawalsErrorsTotalFetching = isFetching;
  const WithdrawalsErrorsTotalError: any = error;
  const refetchWithdrawalsErrorsTotal = refetch;
  return {
    WithdrawalsErrorsTotal,
    isWithdrawalsErrorsTotalFetching,
    WithdrawalsErrorsTotalError,
    refetchWithdrawalsErrorsTotal,
  };
}
