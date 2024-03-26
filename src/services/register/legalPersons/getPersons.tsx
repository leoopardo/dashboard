/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import {
  LegalPersonsQuery,
  LegalPersonsResponse,
} from "@src/services/types/register/legalPersons/persons.interface";
import { useQuery } from "react-query";

export function useGetLegalPersons(params: LegalPersonsQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    LegalPersonsResponse | null | undefined
  >("LegalPersons", async () => {
    const response = await api.get("customer/companies", {
      params: {
        ...params,
        cnpj: params.cnpj ? params?.cnpj?.replace(/[^\d]/g, "") : undefined,
      },
    });
    return response.data;
  });

  const LegalPersonsData = data;
  const isLegalPersonsDataFetching = isFetching;
  const LegalPersonsDataError: any = error;
  const refetchLegalPersonsData = refetch;
  return {
    LegalPersonsData,
    isLegalPersonsDataFetching,
    LegalPersonsDataError,
    refetchLegalPersonsData,
  };
}
