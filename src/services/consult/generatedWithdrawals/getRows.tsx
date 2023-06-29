import moment from "moment";
import { api } from "../../../config/api";
import { useQuery } from "react-query";
import { generatedWithdrawalsRowsQuery, generatedWithdrawalsRowsResponse } from "../../types/consult/withdrawals/generatedWithdrawals.interface";

export function useGetRowsGeneratedWithdrawals(
  params: generatedWithdrawalsRowsQuery
) {
  const { data, isFetching, error, refetch } = useQuery<
    generatedWithdrawalsRowsResponse | null | undefined
  >(
    "witrawalsRows",
    async () => {
      const response = await api.get("report/withdraw/rows", {
        params: {
          ...params,
          initial_date: params.initial_date
          ? moment(params.initial_date)
              .add(3, "hours")
              .format("YYYY-MM-DDTHH:mm:ss.SSS")
          : '',
        final_date: params.final_date
          ? moment(params.final_date)
              .add(3, "hours")
              .format("YYYY-MM-DDTHH:mm:ss.SSS")
          : '',
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

  const witrawalsRows = data;
  const isWithdrawalsRowsFetching = isFetching;
  const witrawalsRowsError: any = error;
  const refetchWithdrawalsTotalRows = refetch;
  return {
    witrawalsRows,
    isWithdrawalsRowsFetching,
    witrawalsRowsError,
    refetchWithdrawalsTotalRows,
  };
}
