/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import {
  LicenseQuery,
  LicenseResponse,
} from "@src/services/types/register/licenses/licenses.interface";
import { useEffect } from "react";
import { useQuery } from "react-query";

export function useListLicenses(params: LicenseQuery) {
  const { data, isFetching, error, refetch, isSuccess } = useQuery<
    LicenseResponse | null | undefined
  >("ListLicenses", async () => {
    const response = await api.get("core/license/list", {
      params,
    });
    return response.data;
  });

  useEffect(() => {
    refetch();
  }, [params]);

  const LicenseData = data;
  const isSuccessLicenseData = isSuccess;
  const isLicenseDataFetching = isFetching;
  const LicenseDataError: any = error;
  const refetchLicenseData = refetch;
  return {
    LicenseData,
    isLicenseDataFetching,
    isSuccessLicenseData,
    LicenseDataError,
    refetchLicenseData,
  };
}
