/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { AggregatorAttachmentsItem } from "@src/services/types/register/aggregators/attachments/aggregatorAttachments.interface";
import { useMutation } from "react-query";

export interface CreateFileInterface {
  file_name?: string;
  base64_file?: string;
  aggregator_id?: number;
}

export function useCreateAggregatorAttachment(body?: CreateFileInterface) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    AggregatorAttachmentsItem | null | undefined
  >("uploadAggregatorAttachment", async () => {
    const response = await api.post("core/aggregator/files/upload", body, {});
    await queryClient.refetchQueries({ queryKey: ["AggregatorAttachments"] });
    return response.data;
  });

  const AggregatorAttachmentMutate = mutate;
  const AggregatorAttachmentIsLoading = isLoading;
  const AggregatorAttachmentError: any = error;
  const AggregatorAttachmentIsSuccess = isSuccess;
  const AggregatorAttachmentReset = reset;

  return {
    AggregatorAttachmentMutate,
    AggregatorAttachmentReset,
    AggregatorAttachmentIsLoading,
    AggregatorAttachmentError,
    AggregatorAttachmentIsSuccess,
  };
}
