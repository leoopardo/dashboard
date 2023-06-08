import { useEffect, useState } from "react";
import { api } from "../../config/api";
import {
  generatedDepositTotal,
  generatedDepositTotalQuery,
} from "../types/generatedDeposits.interface";
import { useQuery } from "react-query";

export function useGetTotalGeneratedDeposits(
  params: generatedDepositTotalQuery
) {
  const { data, isFetching, error, refetch } = useQuery<
    generatedDepositTotal | null | undefined
  >("depositsTotal", async () => {
    const response = await api.get("report/pix/total", { params });
    return response.data;
  });

  const depositsTotal = data;
  const isDepositsTotalFetching = isFetching;
  const depositsTotalError: any = error;
  const refetchDepositsTotal = refetch;

  return {
    depositsTotal,
    isDepositsTotalFetching,
    depositsTotalError,
    refetchDepositsTotal,
  };
}
