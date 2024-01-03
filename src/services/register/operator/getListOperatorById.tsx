/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { api } from "@src/config/api";
import { useQuery } from "react-query";

export function useListOperatorById(params: any) {
  const { data, isFetching, error, refetch } = useQuery<
    { name: string; id: number } | null | undefined
  >("operatorByIdList", async () => {
    const response = await api.get("core/operator", {
      params,
    });
    return response.data;
  }, {enabled: params.enabled === true});

  const Operator = data;
  const isOperatorFetching = isFetching;
  const OperatorError: any = error;
  const refetcOperator = refetch;

  return {
    Operator,
    isOperatorFetching,
    OperatorError,
    refetcOperator,
  };
}
