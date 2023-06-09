import { api } from "../../config/api";
import { getDeposit } from "../types/generatedDeposits.interface";
import { useQuery } from "react-query";

export function useGetDeposit(id: string) {
  const { data, isFetching, error, refetch } = useQuery<
    getDeposit | null | undefined
  >(
    "deposit",
    async () => {
      const response = await api.get(`report/pix/byid/${id}`);
      return response.data;
    },
    { refetchOnWindowFocus: "always" }
  );

  const deposit = data;
  const isDepositFetching = isFetching;
  const depositError: any = error;
  const refetchDeposit = refetch;
  return {
    deposit,
    isDepositFetching,
    depositError,
    refetchDeposit,
  };
}
