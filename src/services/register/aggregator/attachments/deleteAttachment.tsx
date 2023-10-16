/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { AggregatorAttachmentsItem } from "@src/services/types/register/aggregators/attachments/aggregatorAttachments.interface";
import { useMutation } from "react-query";

export function useDeleteAggregatorAttachment(id: string) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    AggregatorAttachmentsItem | null | undefined
  >("deleteAggregatorAttachment", async () => {
    const response = await api.delete(`core/aggregator/files/delete/${id}`, {});
    await queryClient.refetchQueries({ queryKey: ["AggregatorAttachments"] });
    return response.data;
  });

  const DeleteAggregatorAttachmentMutate = mutate;
  const DeleteAggregatorAttachmentIsLoading = isLoading;
  const DeleteAggregatorAttachmentError: any = error;
  const DeleteAggregatorAttachmentIsSuccess = isSuccess;
  const DeleteAggregatorAttachmentReset = reset;

  return {
    DeleteAggregatorAttachmentMutate,
    DeleteAggregatorAttachmentReset,
    DeleteAggregatorAttachmentIsLoading,
    DeleteAggregatorAttachmentError,
    DeleteAggregatorAttachmentIsSuccess,
  };
}
