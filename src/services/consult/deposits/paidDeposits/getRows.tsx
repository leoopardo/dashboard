/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";
import {
  paidDepositRowsQuery,
  paidDepositRowsResponse,
} from "../../../types/consult/deposits/PaidDeposits.interface";

export function useGetRowsPaidDeposits(params: paidDepositRowsQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    paidDepositRowsResponse | null | undefined
  >(
    "depositsRows",
    async () => {
      const response = await api.get("report/pix/rows/paid-at", {
        params: {
          ...params,
          initial_date: params.initial_date
            ? moment(params.initial_date)
                .add(3, "hours")
                .format("YYYY-MM-DDTHH:mm:ss.SSS")
            : null,
          final_date: params.final_date
            ? moment(params.final_date)
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
      refetchOnWindowFocus: false,
    }
  );

  const paidRows = data;
  const isPaidRowsFetching = isFetching;
  const paidRowsError: any = error;
  const refetchPaidTotalRows = refetch;
  return {
    paidRows,
    isPaidRowsFetching,
    paidRowsError,
    refetchPaidTotalRows,
  };
}
