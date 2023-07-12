/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import { IOrganizationConfigResponse } from "@src/services/types/register/merchants/organizationConfig.interface";
import { useQuery } from "react-query";

export function useOrganizationConfig(id?: string) {
  const { data, isFetching, error, refetch } =
    useQuery<IOrganizationConfigResponse | null>(
      "OrganizationConfig",
      async () => {
        const response = await api.get("core/merchant/config/paybrokers", {
          params: { merchant_id: id },
        });
        return response.data;
      },
      {
        refetchInterval: false,
        refetchIntervalInBackground: false,
        refetchOnMount: false,
      }
    );

  const organizationConfigData = data;
  const isOrganizationConfigFetching = isFetching;
  const organizationConfigError: any = error;
  const refetchOrganizationConfigData = refetch;
  return {
    organizationConfigData,
    isOrganizationConfigFetching,
    organizationConfigError,
    refetchOrganizationConfigData,
  };
}
