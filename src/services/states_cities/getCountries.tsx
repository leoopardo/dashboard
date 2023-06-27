import { useQuery } from "react-query";
import { CountryInterface } from "../types/states_cities.interface";
import axios from "axios";

export function useGetrefetchCountries() {
  const { data, isFetching, error, refetch } = useQuery<
    CountryInterface[] | null | undefined
  >(
    "Countries",
    async () => {
      const response = await axios.get(
        "https://restcountries.com/v3.1/all",
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

  const Countries = data;
  const isCountriesFetching = isFetching;
  const countriesError: any = error;
  const refetchCountries = refetch;
  return {
    Countries,
    isCountriesFetching,
    countriesError,
    refetchCountries,
  };
}
