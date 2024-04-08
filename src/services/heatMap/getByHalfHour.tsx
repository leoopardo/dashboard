/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from "react-query";
import { api } from "../../config/api";
import { lastHalfHour } from "../types/heatMap/heatMap.interface";

export function useGetLastHalfHour(params: any) {
  const { data, isFetching, error, refetch } = useQuery<
    lastHalfHour | null | undefined
  >(
    "getHalfHour",
    async () => {
      const response = await api.get("/report/pix/half-hour", {
        params,
      });
      return response.data;
    },
    { refetchInterval: 1000 * 60 }
  );

  const lastHalfHour = data;
  const isLastHalfHourFetching = isFetching;
  const lastHalfHourError: any = error;
  const refetchLastHalfHour = refetch;

  return {
    lastHalfHour,
    isLastHalfHourFetching,
    lastHalfHourError,
    refetchLastHalfHour,
  };
}
