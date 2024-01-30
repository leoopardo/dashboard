/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ReportsData,
  ReportsQuery,
} from "@src/services/types/reports/reports.interface";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetOrganizationCurrentAccounts(params: ReportsQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    ReportsData | null | undefined
  >("OrganizationCurrentAccounts", async () => {
    const response = await api.get("core/account/", {
      params,
    });
    return response.data;
  });

  const CurrentAccountData = data;
  const isCurrentAccountDataFetching = isFetching;
  const CurrentAccountDataError: any = error;
  const refetchCurrentAccountData = refetch;
  return {
    CurrentAccountData,
    isCurrentAccountDataFetching,
    CurrentAccountDataError,
    refetchCurrentAccountData,
  };
}
