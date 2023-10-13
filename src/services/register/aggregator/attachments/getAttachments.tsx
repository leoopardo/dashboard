/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import { AggregatorAttachmentsQuery, AggregatorAttachmentsResponse } from "@src/services/types/register/aggregators/attachments/aggregatorAttachments.interface";
import { useQuery } from "react-query";

export function useGetAggregatorAttachments(params: AggregatorAttachmentsQuery) {
  const { data, isFetching, error, refetch } = useQuery<
  AggregatorAttachmentsResponse | null | undefined
  >("AggregatorAttachments", async () => {
    const response = await api.get("core/aggregator/files", {
      params,
    });
    return response.data;
  });



  const AggregatorAttachmentsData = data;
  const isAggregatorAttachmentsDataFetching = isFetching;
  const AggregatorAttachmentsDataError: any = error;
  const refetchAggregatorAttachmentsData = refetch;
  return {
    AggregatorAttachmentsData,
    isAggregatorAttachmentsDataFetching,
    AggregatorAttachmentsDataError,
    refetchAggregatorAttachmentsData,
  };
}
