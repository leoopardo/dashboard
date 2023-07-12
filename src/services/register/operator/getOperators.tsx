/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import {
  OperatorQuery,
  OperatorsResponse,
} from "@src/services/types/register/operators/operators.interface";
import { useQuery } from "react-query";

export function useGetOperator(params: OperatorQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    OperatorsResponse | null | undefined
  >("Operator", async () => {
    const response = await api.get("core/operator", {
      params,
    });
    return response.data;
  });

  const OperatorData = data;
  const isOperatorDataFetching = isFetching;
  const OperatorDataError: any = error;
  const refetchOperatorData = refetch;
  return {
    OperatorData,
    isOperatorDataFetching,
    OperatorDataError,
    refetchOperatorData,
  };
}
