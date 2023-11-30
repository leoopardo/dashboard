/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";

import { IFeePlansDetailsResponse } from "@src/services/types/register/merchants/merchantFeePlans.interface";
import { useQuery } from "react-query";

export function useGetFeePlansDetails(params?: { fee_plans_id?: string}) {
  const { data, isFetching, error, refetch  } = useQuery<
  IFeePlansDetailsResponse | null | undefined
  >(
    "MerchantsFeePlansDetails",
    async () => {
      const response = await api.get("core/fee_plans_details", {
        params,
      });
      return response.data;
    },
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false
    }
  );

  const feePlansDetailsData = data;
  const isFeePlansDetailsDataFetching = isFetching;
  const feePlansDetailsDataError: any = error;
  const refetchFeePlansDetailsData = refetch;
  return {
    feePlansDetailsData,
    isFeePlansDetailsDataFetching,
    feePlansDetailsDataError,
    refetchFeePlansDetailsData,
  };
}
