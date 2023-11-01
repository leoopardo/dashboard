/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheckCpfDetails } from "@src/services/types/consult/persons/checkDocument.interface";
import { useQuery } from "react-query";
import { api } from "../../../config/api";

export function useGetCheckCpfDetails(cpf?: string) {
  const { data, isFetching, error, refetch } = useQuery<
  CheckCpfDetails | null | undefined
  >(
    "BlacklistPersonDetails",
    async () => {
      const response = await api.get(`blacklist/merchant-black-list`, {params: {cpf: cpf}});
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
