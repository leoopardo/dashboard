/* eslint-disable @typescript-eslint/no-explicit-any */
import { LegalPersonsItem } from "@src/services/types/register/legalPersons/persons.interface";
import { useQuery } from "react-query";
import { api } from "../../../config/api";
import { queryClient } from "@src/services/queryClient";

export function useGetCheckCnpj(cnpj?: string) {
  const { data, isFetching, error, refetch, isSuccess, remove } = useQuery<
    LegalPersonsItem | null | undefined
  >(
    "CheckCnpj",
    async () => {
      const response = await api.get(`customer/check_cnpj/${cnpj}`, {});
      await queryClient.refetchQueries({ queryKey: ["LegalPersons"] });
      return response.data;
    },
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      keepPreviousData: false,
      enabled: false,
    }
  );

  const CheckCnpjData = error ? undefined : data;
  const isCheckCnpjDataFetching = isFetching;
  const CheckCnpjDataError: any = error;
  const CheckCnpjDataSuccess: any = isSuccess;
  const refetchCheckCnpjData = refetch;
  const removeCnpj = remove;
  return {
    CheckCnpjData,
    CheckCnpjDataSuccess,
    isCheckCnpjDataFetching,
    CheckCnpjDataError,
    refetchCheckCnpjData,
    removeCnpj,
  };
}
