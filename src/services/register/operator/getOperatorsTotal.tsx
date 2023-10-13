/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import {
  OperatorQuery,
  OperatorsTotalResponse
} from "@src/services/types/register/operators/operators.interface";

import { useQuery } from "react-query";

export function useGetOperatorTotal(params?: OperatorQuery) {
  const { data, isFetching, error, refetch, isSuccess } = useQuery<
  OperatorsTotalResponse | null | undefined
  >("OperatorTotal", async () => {
    const response = await api.get("core/operator/totals", {
      params,
    });
    return response.data;
  });

  const OperatorTotalData = data;
  const isSuccessOperatorTotalData = isSuccess;
  const isOperatorTotalDataFetching = isFetching;
  const OperatorTotalDataError: any = error;
  const refetchOperatorTotalData = refetch;
  return {
    OperatorTotalData,
    isOperatorTotalDataFetching,
    OperatorTotalDataError,
    isSuccessOperatorTotalData,
    refetchOperatorTotalData,
  };
}
