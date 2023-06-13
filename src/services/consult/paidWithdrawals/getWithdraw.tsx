import { api } from "../../../config/api";
import { useQuery } from "react-query";
import { getWithdraw } from "../../types/generatedWithdrawals.interface";

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
