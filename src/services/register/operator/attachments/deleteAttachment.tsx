/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { OperatorAttachmentsItem } from "@src/services/types/register/operators/attachments/aggregatorAttachments.interface";
import { useMutation } from "react-query";

export function useDeleteOperatorAttachment(id: string) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    OperatorAttachmentsItem | null | undefined
  >("deleteOperatorAttachment", async () => {
    const response = await api.delete(`core/operator/files/delete/${id}`, {});
    await queryClient.refetchQueries({ queryKey: ["OperatorAttachments"] });
    return response.data;
  });

  const DeleteOperatorAttachmentMutate = mutate;
  const DeleteOperatorAttachmentIsLoading = isLoading;
  const DeleteOperatorAttachmentError: any = error;
  const DeleteOperatorAttachmentIsSuccess = isSuccess;
  const DeleteOperatorAttachmentReset = reset;

  return {
    DeleteOperatorAttachmentMutate,
    DeleteOperatorAttachmentReset,
    DeleteOperatorAttachmentIsLoading,
    DeleteOperatorAttachmentError,
    DeleteOperatorAttachmentIsSuccess,
  };
}
