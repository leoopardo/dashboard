/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { PartnerAttachmentsItem } from "@src/services/types/register/partners/attachments/aggregatorAttachments.interface";
import { useMutation } from "react-query";

export function useDeletePartnerAttachment(id: string) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    PartnerAttachmentsItem | null | undefined
  >("deletePartnerAttachment", async () => {
    const response = await api.delete(`core/partner/files/delete/${id}`, {});
    await queryClient.refetchQueries({ queryKey: ["PartnerAttachments"] });
    return response.data;
  });

  const DeletePartnerAttachmentMutate = mutate;
  const DeletePartnerAttachmentIsLoading = isLoading;
  const DeletePartnerAttachmentError: any = error;
  const DeletePartnerAttachmentIsSuccess = isSuccess;
  const DeletePartnerAttachmentReset = reset;

  return {
    DeletePartnerAttachmentMutate,
    DeletePartnerAttachmentReset,
    DeletePartnerAttachmentIsLoading,
    DeletePartnerAttachmentError,
    DeletePartnerAttachmentIsSuccess,
  };
}
