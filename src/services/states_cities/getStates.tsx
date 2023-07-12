import axios from "axios";
import { useQuery } from "react-query";
import { StateItem } from "../types/states_cities.interface";

export function useGetStates() {
  const { data, isFetching, error, refetch } = useQuery<
    StateItem[] | null | undefined
  >(
    "States",
    async () => {
      const response = await axios.get(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados",
        {}
      );
      return response.data;
    },
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
    }
  );

  const states = data;
  const isStatesFetching = isFetching;
  const statesError: any = error;
  const refetchStates = refetch;
  return {
    states,
    isStatesFetching,
    statesError,
    refetchStates,
  };
}
