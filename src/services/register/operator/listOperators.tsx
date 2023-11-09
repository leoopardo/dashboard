/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  OperatorQuery,
  OperatorsResponse,
} from "@src/services/types/register/operators/operators.interface";
import { useQuery } from "react-query";
import { api } from "../../../config/api";

export function useListOperators(params: OperatorQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    OperatorsResponse | null | undefined
  >(
    "listOperators",
    async () => {
      const response = await api.get("core/operator", {
        params,
      });
      return response.data;
    },
    { keepPreviousData: false }
  );

  const operatorsData = error
    ? ({ items: [], limit: 200, page: 1, total: 0 } as OperatorsResponse)
    : data;
  const isOperatorsFetching = isFetching;
  const operatorsError: any = error;
  const refetcOperators = refetch;

  return {
    operatorsData,
    isOperatorsFetching,
    operatorsError,
    refetcOperators,
  };
}
