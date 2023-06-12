import { useQuery } from "react-query";
import { CityItem } from "../types/states_citiesTypes";
import axios from "axios";

export function useGetCities(state: string) {
  const { data, isFetching, error, refetch } = useQuery<
    CityItem[] | null | undefined
  >("Cities", async () => {
    const response = await axios.get(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/distritos`,
      {}
    );
    return response.data;
  });

  const cities = data;
  const isCitiesFetching = isFetching;
  const citiesError: any = error;
  const refetchCities = refetch;

  return {
    cities,
    isCitiesFetching,
    citiesError,
    refetchCities,
  };
}
