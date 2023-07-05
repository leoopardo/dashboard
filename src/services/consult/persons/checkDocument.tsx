import { CheckCpf } from "@src/services/types/consult/persons/checkDocument.interface";
import { api } from "../../../config/api";
import { useQuery } from "react-query";

export function useGetCheckCpf(cpf?: string) {
  const { data, isFetching, error, refetch } = useQuery<
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
    }
  );

  const CheckCpfData = data;
  const isCheckCpfDataFetching = isFetching;
  const CheckCpfDataError: any = error;
  const refetchCheckCpfData = refetch;
  return {
    CheckCpfData,
    isCheckCpfDataFetching,
    CheckCpfDataError,
    refetchCheckCpfData,
  };
}
