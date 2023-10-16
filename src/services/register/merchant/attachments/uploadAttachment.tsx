/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { MerchantAttachmentsItem } from "@src/services/types/register/merchants/attachments/aggregatorAttachments.interface";
import { useMutation } from "react-query";

export interface CreateMerchantFileInterface {
  file_name?: string;
  base64_file?: string;
  merchant_id?: number;
}

export function useCreateMerchantAttachment(body?: CreateMerchantFileInterface) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    MerchantAttachmentsItem | null | undefined
  >("uploadMerchantAttachment", async () => {
    const response = await api.post("core/merchant/files/upload", body, {});
    await queryClient.refetchQueries({ queryKey: ["MerchantAttachments"] });
    return response.data;
  });

  const MerchantAttachmentMutate = mutate;
  const MerchantAttachmentIsLoading = isLoading;
  const MerchantAttachmentError: any = error;
  const MerchantAttachmentIsSuccess = isSuccess;
  const MerchantAttachmentReset = reset;

  return {
    MerchantAttachmentMutate,
    MerchantAttachmentReset,
    MerchantAttachmentIsLoading,
    MerchantAttachmentError,
    MerchantAttachmentIsSuccess,
  };
}
