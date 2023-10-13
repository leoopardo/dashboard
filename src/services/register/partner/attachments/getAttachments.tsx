/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import {
  PartnerAttachmentsQuery,
  PartnerAttachmentsResponse,
} from "@src/services/types/register/partners/attachments/aggregatorAttachments.interface";
import { useQuery } from "react-query";

export function useGetPartnerAttachments(params: PartnerAttachmentsQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    PartnerAttachmentsResponse | null | undefined
  >("PartnerAttachments", async () => {
    const response = await api.get("core/partner/files", {
      params,
    });
    return response.data;
  });

  const PartnerAttachmentsData = data;
  const isPartnerAttachmentsDataFetching = isFetching;
  const PartnerAttachmentsDataError: any = error;
  const refetchPartnerAttachmentsData = refetch;
  return {
    PartnerAttachmentsData,
    isPartnerAttachmentsDataFetching,
    PartnerAttachmentsDataError,
    refetchPartnerAttachmentsData,
  };
}
