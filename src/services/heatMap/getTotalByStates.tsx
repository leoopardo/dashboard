/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from "react-query";
import { api } from "../../config/api";
import { getTotalByState } from "../types/heatMap/heatMap.interface";

export function useGetHeatMapTotalByStates(params: any) {
  const { data, isFetching, error, refetch } = useQuery<
    getTotalByState[] | null | undefined
  >("getHeatMapByState", async () => {
    const response = await api.get("report/heat-map/state", {
      params,
    });
    return response.data;
  }, {refetchOnMount: true});

  const heatMapTotalByState = data;
  const isHeatMapTotalByStateFetching = isFetching;
  const heatMapTotalByStateError: any = error;
  const refetcHeatMapTotalByState = refetch;

  return {
    heatMapTotalByState,
    isHeatMapTotalByStateFetching,
    heatMapTotalByStateError,
    refetcHeatMapTotalByState,
  };
}
