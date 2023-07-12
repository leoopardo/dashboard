/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  OrganizationHistoryQuery,
  OrganizationHistoryResponse,
} from "@src/services/types/consult/organization/history";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetOrganizationHistory(params: OrganizationHistoryQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    OrganizationHistoryResponse | null | undefined
  >("OrganizationHistory", async () => {
    const response = await api.get("account/organization-account/history", {
      params,
    });

    return response.data;
  });

  const OrganizationHistory = data;
  const isOrganizationHistoryFetching = isFetching;
  const OrganizationHistoryError: any = error;
  const refetchOrganizationHistory = refetch;
  return {
    OrganizationHistory,
    isOrganizationHistoryFetching,
    OrganizationHistoryError,
    refetchOrganizationHistory,
  };
}
