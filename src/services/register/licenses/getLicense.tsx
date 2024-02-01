/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import {
  LicenseItem,
} from "@src/services/types/register/licenses/licenses.interface";
import { useQuery } from "react-query";

export function useShowLicenses(id?: number) {
  const { data, isFetching, error, refetch, isSuccess } = useQuery<
  LicenseItem | null | undefined
  >("GetLicenseAttached", async () => {
    const response = await api.get(`core/attached-merchants/license/${id}`, {
    });
    return response.data;
  });


  const ShowLicenseData = data;
  const isSuccessShowLicenseData = isSuccess;
  const isShowLicenseDataFetching = isFetching;
  const ShowLicenseDataError: any = error;
  const refetchShowLicenseData = refetch;
  return {
    ShowLicenseData,
    isShowLicenseDataFetching,
    isSuccessShowLicenseData,
    ShowLicenseDataError,
    refetchShowLicenseData,
  };
}
