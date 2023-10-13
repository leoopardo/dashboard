/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { MerchantAttachmentsItem } from "@src/services/types/register/merchants/attachments/aggregatorAttachments.interface";
import { useMutation } from "react-query";

export function useDeleteMerchantAttachment(id: string) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    MerchantAttachmentsItem | null | undefined
  >("deleteMerchantAttachment", async () => {
    const response = await api.delete(`core/merchant/files/delete/${id}`, {});
    await queryClient.refetchQueries({ queryKey: ["MerchantAttachments"] });
    return response.data;
  });

  const DeleteMerchantAttachmentMutate = mutate;
  const DeleteMerchantAttachmentIsLoading = isLoading;
  const DeleteMerchantAttachmentError: any = error;
  const DeleteMerchantAttachmentIsSuccess = isSuccess;
  const DeleteMerchantAttachmentReset = reset;

  return {
    DeleteMerchantAttachmentMutate,
    DeleteMerchantAttachmentReset,
    DeleteMerchantAttachmentIsLoading,
    DeleteMerchantAttachmentError,
    DeleteMerchantAttachmentIsSuccess,
  };
}
