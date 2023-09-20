/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import {
  GetMovimentsData,
  GetMovimentsQuery,
} from "@src/services/types/moviments/organization/getMoviments";
import { useQuery } from "react-query";

export function useGetOrganizationMoviments(params: GetMovimentsQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    GetMovimentsData | null | undefined
  >("OrganizationMoviments", async () => {
    const response = await api.get("core/entry-account/organization", {
      params,
    });
    return response.data;
  });

  const OrganizationMovimentsData: GetMovimentsData | null | undefined = {
    total_in_canceled: data?.total_in_canceled,
    total_in_processing: data?.total_in_processing,
    total_in_success: data?.total_in_success,
    total_out_canceled: data?.total_out_canceled,
    total_out_processing: data?.total_out_processing,
    total_out_success: data?.total_out_success,
    ...data,
  };
  const isOrganizationMovimentsDataFetching = isFetching;
  const OrganizationMovimentsDataError: any = error;
  const refetchOrganizationMovimentsData = refetch;
  return {
    OrganizationMovimentsData,
    isOrganizationMovimentsDataFetching,
    OrganizationMovimentsDataError,
    refetchOrganizationMovimentsData,
  };
}
