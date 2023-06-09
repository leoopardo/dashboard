import { api } from "../../config/api";
import { getDeposit } from "../types/generatedDeposits.interface";
import { useQuery } from "react-query";

interface TokenInterface {
  token: string;
}

export function useToken(
  user: { username: string; password: string },
  rememberMe: boolean
) {
  const { data, isFetching, error, refetch } = useQuery<
  TokenInterface | null | undefined
  >(
    "token",
    async () => {
      const response = await api.get("core/token", { data: user });
      return response.data;
    },
    { refetchOnWindowFocus: rememberMe ? "always" : false }
  );

  const responseToken = data;
  const isTokenFetching = isFetching;
  const tokenError: any = error;
  const refetchDToken = refetch;
  return {
    responseToken,
    isTokenFetching,
    tokenError,
    refetchDToken,
  };
}
