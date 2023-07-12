import { api } from "@config/api";
import {
  PersonsQuery,
  PersonsResponse,
} from "@src/services/types/register/persons/persons.interface";
import { useQuery } from "react-query";

export function useGetPersons(params: PersonsQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    PersonsResponse | null | undefined
  >("Persons", async () => {
    const response = await api.get("customer/persons", {
      params,
    });
    return response.data;
  });

  const PersonsData = data;
  const isPersonsDataFetching = isFetching;
  const PersonsDataError: any = error;
  const refetchPersonsData = refetch;
  return {
    PersonsData,
    isPersonsDataFetching,
    PersonsDataError,
    refetchPersonsData,
  };
}
