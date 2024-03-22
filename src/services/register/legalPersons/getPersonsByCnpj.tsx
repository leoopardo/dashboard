/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import { LegalPersonsItem } from "@src/services/types/register/legalPersons/persons.interface";
import { useQuery } from "react-query";

export function useGetLegalPersonsByCnpj(cnpj?: string) {
  const { data, isFetching, error, refetch } = useQuery<
    LegalPersonsItem | null | undefined
  >("LegalPersonsByCnpj", async () => {
    const response = await api.get(`customer/company/${cnpj}`);
    return response.data;
  });

  const LegalPersonsByCnpjData: LegalPersonsItem = {
    ...data,
    black_list: data ? (data?.black_list ? "true" : "false") : undefined,
    flag_pep: data ? (data?.flag_pep ? "true" : "false") : undefined,
  };
  const isLegalPersonsByCnpjDataFetching = isFetching;
  const LegalPersonsByCnpjDataError: any = error;
  const refetchLegalPersonsByCnpjData = refetch;
  return {
    LegalPersonsByCnpjData,
    isLegalPersonsByCnpjDataFetching,
    LegalPersonsByCnpjDataError,
    refetchLegalPersonsByCnpjData,
  };
}
