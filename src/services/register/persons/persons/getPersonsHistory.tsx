/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import {
  PersonsQuery,
  PersonHistory,
  PersonHistoryResponse,
} from "@src/services/types/register/persons/persons.interface";
import { useQuery } from "react-query";

export function useGetPersonHistory(params: PersonsQuery, cpf?: string) {
  const { data, isFetching, error, refetch } = useQuery<
    PersonHistoryResponse | null | undefined
  >("PersonsHistory", async () => {
    const response = await api.get(`customer/${cpf}/history`, {
      params,
    });
    return response.data;
  });

  const PersonsHistoryData = data;
  const isPersonsHistoryDataFetching = isFetching;
  const PersonsHistoryDataError: any = error;
  const refetchHistoryPersonsData = refetch;
  return {
    PersonsHistoryData,
    isPersonsHistoryDataFetching,
    PersonsHistoryDataError,
    refetchHistoryPersonsData,
  };
}

export function useGetPersonHistoryDetails(
  params: PersonsQuery,
  cpf: string,
  id: string
) {
  const { data, isFetching, error, refetch } = useQuery<
  PersonHistory | null | undefined
  >("PersonsHistoryDetails", async () => {
    const response = await api.get(`customer/${cpf}/history/${id}`, {
      params,
    });
    return response.data;
  });

  const PersonsHistoryDetailsData = data;
  const isPersonsHistorDetailsyDataFetching = isFetching;
  const PersonsHistoryDetailsDataError: any = error;
  const refetchHistoryPersonsDetailsData = refetch;
  return {
    PersonsHistoryDetailsData,
    isPersonsHistorDetailsyDataFetching,
    PersonsHistoryDetailsDataError,
    refetchHistoryPersonsDetailsData,
  };
}
