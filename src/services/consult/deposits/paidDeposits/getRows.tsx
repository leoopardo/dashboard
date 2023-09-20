/* eslint-disable @typescript-eslint/no-explicit-any */
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
        params
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
