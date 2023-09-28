/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    AuthLogsData,
    AuthLogsQuery,
} from "@src/services/types/support/apiLogs/authLogs.interface";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetAuthLogs(params: AuthLogsQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    AuthLogsData | null | undefined
  >("AuthLogs", async () => {
    const response = await api.get("report/logs/api-auth", {
      params,
    });
    return response.data;
  });

  const AuthLogs = data;
  const isAuthLogsFetching = isFetching;
  const AuthLogsError: any = error;
  const refetchAuthLogs = refetch;
  return {
    AuthLogs,
    isAuthLogsFetching,
    AuthLogsError,
    refetchAuthLogs,
  };
}
