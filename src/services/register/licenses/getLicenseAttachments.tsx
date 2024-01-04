/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import {
  LicenseQuery,
  LicenseAttachmentsResponse,
} from "@src/services/types/register/licenses/licenses.interface";
import { useQuery } from "react-query";

export function useGetLicensesAttachments(params: LicenseQuery) {
  const { data, isFetching, error, refetch, isSuccess } = useQuery<
  LicenseAttachmentsResponse | null | undefined
  >("LicensesAttachments", async () => {
    const response = await api.get("core/license/files", {
      params,
    });
    return response.data;
  });

  const LicenseDataAttachments = data;
  const isSuccessLicenseDataAttachmentsData = isSuccess;
  const isLicenseDataAttachmentsDataFetching = isFetching;
  const LicenseDataAttachmentsDataError: any = error;
  const refetchLicenseDataAttachmentsData = refetch;
  return {
    LicenseDataAttachments,
    isLicenseDataAttachmentsDataFetching,
    isSuccessLicenseDataAttachmentsData,
    LicenseDataAttachmentsDataError,
    refetchLicenseDataAttachmentsData,
  };
}