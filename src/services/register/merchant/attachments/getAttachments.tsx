/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import {
  MerchantAttachmentsQuery,
  MerchantAttachmentsResponse,
} from "@src/services/types/register/merchants/attachments/aggregatorAttachments.interface";
import { useQuery } from "react-query";

export function useGetMerchantAttachments(params: MerchantAttachmentsQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    MerchantAttachmentsResponse | null | undefined
  >("MerchantAttachments", async () => {
    const response = await api.get("core/merchant/files", {
      params,
    });
    return response.data;
  });

  const MerchantAttachmentsData = data;
  const isMerchantAttachmentsDataFetching = isFetching;
  const MerchantAttachmentsDataError: any = error;
  const refetchMerchantAttachmentsData = refetch;
  return {
    MerchantAttachmentsData,
    isMerchantAttachmentsDataFetching,
    MerchantAttachmentsDataError,
    refetchMerchantAttachmentsData,
  };
}
