import { useEffect, useState } from "react";
import { api } from "../../../config/api";
import {
  AggregatorQuery,
  AggregatorsResponse,
} from "@src/services/types/register/aggregators/aggregators.interface";

export function useListAggregators(params: AggregatorQuery) {
  const [data, setData] = useState<AggregatorsResponse | null>(null);
  const [error, setError] = useState<any>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchAggregators = async () => {
    try {
      setIsFetching(true);
      const response = await api.get("core/aggregator", {
        params,
      });
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchAggregators();
  }, [params]);

  const partnersData = data;
  const isAggregatorsFetching = isFetching;
  const partnersError: any = error;
  const refetcAggregators = fetchAggregators;

  return {
    partnersData,
    isAggregatorsFetching,
    partnersError,
    refetcAggregators,
  };
}
