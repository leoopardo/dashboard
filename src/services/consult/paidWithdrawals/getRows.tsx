import moment from "moment";
import { api } from "../../../config/api";

import { useQuery } from "react-query";
import {
  paidWithdrawalsRowsQuery,
  paidWithdrawalsRowsResponse,
} from "../../types/paidWithdrawals.interface";
export function useGetRowsPaidWithdrawals(params: paidWithdrawalsRowsQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    paidWithdrawalsRowsResponse | null | undefined
  >(
    "paidWithdrawalsRows",
    async () => {
      const response = await api.get("report/withdraw/rows/paid-at", {
        params: {
          ...params,
          initial_date: moment(params.initial_date)
            .add(3, "hours")
            .format("YYYY-MM-DDTHH:mm:ss.SSS"),
          final_date: moment(params.final_date)
            .add(3, "hours")
            .format("YYYY-MM-DDTHH:mm:ss.SSS"),
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

  const paidWithdrawalsRows = data;
  const isPaidWithdrawalsRowsFetching = isFetching;
  const paidWithdrawalsRowsError: any = error;
  const refetchPaidWithdrawalsTotalRows = refetch;
  return {
    paidWithdrawalsRows,
    isPaidWithdrawalsRowsFetching,
    paidWithdrawalsRowsError,
    refetchPaidWithdrawalsTotalRows,
  };
}
