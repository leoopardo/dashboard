/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@src/config/api";
import {
  SerproAssertivaData,
  SerproAssertivaQuery,
} from "@src/services/types/consult/persons/serproAssertiva.interface";
import { useQuery } from "react-query";

export function useGetSerproAssertiva(params?: SerproAssertivaQuery) {
  const { data, isFetching, error, refetch, isSuccess } = useQuery<
    SerproAssertivaData | null | undefined
  >(
    "SerproAssertiva",
    async () => {
      const response = await api.get("customer/check_cpf/history/count", { params });
      return response.data;
    },
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  return {
    data,
    isFetching,
    error,
    refetch,
    isSuccess,
  };
}
