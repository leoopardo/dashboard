/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheckCpf } from "@src/services/types/consult/persons/checkDocument.interface";
import { useQuery } from "react-query";
import { api } from "../../../config/api";

export function useGetCheckCpf(cpf?: string) {
  const { data, isFetching, error, refetch, isSuccess } = useQuery<
    CheckCpf | null | undefined
  >(
    "CheckCpf",
    async () => {
      const response = await api.get(`customer/check_cpf/${cpf}`, {});
      return response.data;
    },
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      keepPreviousData: false,
    }
  );

  const CheckCpfData = error ? undefined : data;
  const isCheckCpfDataFetching = isFetching;
  const CheckCpfDataError: any = error;
  const CheckCpfDataSuccess: any = isSuccess;
  const refetchCheckCpfData = refetch;
  return {
    CheckCpfData,
    CheckCpfDataSuccess,
    isCheckCpfDataFetching,
    CheckCpfDataError,
    refetchCheckCpfData,
  };
}
