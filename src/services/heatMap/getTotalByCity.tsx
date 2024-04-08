/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from "react-query";
import { api } from "../../config/api";
import {
  getTotalByCity
} from "../types/heatMap/heatMap.interface";

export function useGetHeatMapTotalByCity(params: any) {
  const { data, isFetching, error, refetch } = useQuery<
    getTotalByCity[] | null | undefined
  >("getHeatMapByCity", async () => {
    const response = await api.get("report/heat-map/city", {
      params,
    });
    return response.data;
  });

  const heatMapTotalByCity = data;
  const isHeatMapTotalByCityFetching = isFetching;
  const heatMapTotalByCityError: any = error;
  const refetcHeatMapTotalByCity = refetch;

  return {
    heatMapTotalByCity,
    isHeatMapTotalByCityFetching,
    heatMapTotalByCityError,
    refetcHeatMapTotalByCity,
  };
}
