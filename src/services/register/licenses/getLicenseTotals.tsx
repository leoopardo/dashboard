/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import {
  LicenseQuery,
  LicenseTotalResponse,
} from "@src/services/types/register/licenses/licenses.interface";
import { useEffect } from "react";
import { useQuery } from "react-query";

export function useGetLicensesTotals(params: LicenseQuery) {
  const { data, isFetching, error, refetch, isSuccess } = useQuery<
  LicenseTotalResponse | null | undefined
  >("LicensesTotal", async () => {
    const response = await api.get("core/license/totals", {
      params,
    });
    return response.data;
  });

  useEffect(() => {
    refetch();
  }, [params]);

  const LicenseDataTotal = data;
  const isSuccessLicenseDataTotalData = isSuccess;
  const isLicenseDataTotalDataFetching = isFetching;
  const LicenseDataTotalDataError: any = error;
  const refetchLicenseDataTotalData = refetch;
  return {
    LicenseDataTotal,
    isLicenseDataTotalDataFetching,
    isSuccessLicenseDataTotalData,
    LicenseDataTotalDataError,
    refetchLicenseDataTotalData,
  };
}