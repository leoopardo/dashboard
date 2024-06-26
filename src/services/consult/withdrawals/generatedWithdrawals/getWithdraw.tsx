/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "react-query";
import { api } from "../../../../config/api";
import { getWithdraw } from "../../../types/consult/withdrawals/generatedWithdrawals.interface";

export function useGetWithdraw(id: string) {
  const { data, isFetching, error, refetch } = useQuery<
    getWithdraw | null | undefined
  >(
    "withdraw",
    async () => {
      const response = await api.get(`report/withdraw/byid/${id}`);
      return response.data;
    },
    { refetchOnWindowFocus: "always" }
  );

  const withdraw = data;
  const isWithdrawFetching = isFetching;
  const withdrawError: any = error;
  const refetchWithdraw = refetch;
  return {
    withdraw,
    isWithdrawFetching,
    withdrawError,
    refetchWithdraw,
  };
}
