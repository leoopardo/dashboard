/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { OperatorAttachmentsItem } from "@src/services/types/register/operators/attachments/aggregatorAttachments.interface";
import { useMutation } from "react-query";

export interface CreateOperatorFileInterface {
  file_name?: string;
  base64_file?: string;
  operator_id?: number;
}

export function useCreateOperatorAttachment(body?: CreateOperatorFileInterface) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    OperatorAttachmentsItem | null | undefined
  >("uploadOperatorAttachment", async () => {
    const response = await api.post("core/operator/files/upload", body, {});
    await queryClient.refetchQueries({ queryKey: ["OperatorAttachments"] });
    return response.data;
  });

  const OperatorAttachmentMutate = mutate;
  const OperatorAttachmentIsLoading = isLoading;
  const OperatorAttachmentError: any = error;
  const OperatorAttachmentIsSuccess = isSuccess;
  const OperatorAttachmentReset = reset;

  return {
    OperatorAttachmentMutate,
    OperatorAttachmentReset,
    OperatorAttachmentIsLoading,
    OperatorAttachmentError,
    OperatorAttachmentIsSuccess,
  };
}
