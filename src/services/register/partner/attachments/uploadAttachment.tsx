/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { PartnerAttachmentsItem } from "@src/services/types/register/partners/attachments/aggregatorAttachments.interface";
import { useMutation } from "react-query";

export interface CreatePartnerFileInterface {
  file_name?: string;
  base64_file?: string;
  partner_id?: number;
}

export function useCreatePartnerAttachment(body?: CreatePartnerFileInterface) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    PartnerAttachmentsItem | null | undefined
  >("uploadPartnerAttachment", async () => {
    const response = await api.post("core/partner/files/upload", body, {});
    await queryClient.refetchQueries({ queryKey: ["PartnerAttachments"] });
    return response.data;
  });

  const PartnerAttachmentMutate = mutate;
  const PartnerAttachmentIsLoading = isLoading;
  const PartnerAttachmentError: any = error;
  const PartnerAttachmentIsSuccess = isSuccess;
  const PartnerAttachmentReset = reset;

  return {
    PartnerAttachmentMutate,
    PartnerAttachmentReset,
    PartnerAttachmentIsLoading,
    PartnerAttachmentError,
    PartnerAttachmentIsSuccess,
  };
}
