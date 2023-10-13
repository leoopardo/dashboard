/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import { OperatorAttachmentsQuery, OperatorAttachmentsResponse } from "@src/services/types/register/operators/attachments/aggregatorAttachments.interface";
import { useQuery } from "react-query";

export function useGetOperatorAttachments(params: OperatorAttachmentsQuery) {
  const { data, isFetching, error, refetch } = useQuery<
  OperatorAttachmentsResponse | null | undefined
  >("OperatorAttachments", async () => {
    const response = await api.get("core/operator/files", {
      params,
    });
    return response.data;
  });



  const OperatorAttachmentsData = data;
  const isOperatorAttachmentsDataFetching = isFetching;
  const OperatorAttachmentsDataError: any = error;
  const refetchOperatorAttachmentsData = refetch;
  return {
    OperatorAttachmentsData,
    isOperatorAttachmentsDataFetching,
    OperatorAttachmentsDataError,
    refetchOperatorAttachmentsData,
  };
}
