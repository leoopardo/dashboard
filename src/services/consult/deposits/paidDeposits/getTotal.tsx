/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../../../../config/api";
import {
  paidDepositRowsQuery,
  paidDepositTotal,
} from "../../../types/consult/deposits/PaidDeposits.interface";
import { useQuery } from "react-query";

export function useGetTotalPaidDeposits(params: paidDepositRowsQuery) {
  const { data, isFetching, error, refetch } = useQuery<
  paidDepositTotal | null | undefined
  >(
    "depositsPaidTotal",
    async () => {
      const response = await api.get("report/pix/total/paid-at", {
        params,
      });
      return response.data;
    }
  );


  const paidTotal = data;
  const isPaidTotalFetching = isFetching;
  const paidTotalError: any = error;
  const refetchPaidTotal = refetch;

  return {
    paidTotal,
    isPaidTotalFetching,
    paidTotalError,
    refetchPaidTotal,
  };
}
