/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from "react-query";
import { api } from "../../config/api";
import { lastHalfHour } from "../types/heatMap/heatMap.interface";

export function useGetLastHalfHourWithdraw(params: any) {
  const { data, isFetching, error, refetch } = useQuery<
    lastHalfHour | null | undefined
  >(
    "getHalfHourWithdraw",
    async () => {
      const response = await api.get("/report/withdraw/half-hour", {
        params,
      });
      return response.data;
    },
    { refetchInterval: 1000 * 60 }
  );

  const lastHalfHourWithdraw = data;
  const isLastHalfHourWithdrawFetching = isFetching;
  const lastHalfHourWithdrawError: any = error;
  const refetchLastHalfHourWithdraw = refetch;

  return {
    lastHalfHourWithdraw,
    isLastHalfHourWithdrawFetching,
    lastHalfHourWithdrawError,
    refetchLastHalfHourWithdraw,
  };
}
