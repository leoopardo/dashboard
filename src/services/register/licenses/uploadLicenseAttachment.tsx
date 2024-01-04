/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { PartnerAttachmentsItem } from "@src/services/types/register/partners/attachments/aggregatorAttachments.interface";
import { useMutation } from "react-query";

export interface CreateLicenseFileInterface {
  file_name?: string;
  base64_file?: string;
  license_id?: number;
}

export function useCreateLicenseAttachment(body?: CreateLicenseFileInterface) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    PartnerAttachmentsItem | null | undefined
  >("uploadLicenseAttachment", async () => {
    const response = await api.post("core/license/files/upload", body, {});
    await queryClient.refetchQueries({ queryKey: ["LicensesAttachments"] });
    return response.data;
  });

  const LicenseAttachmentMutate = mutate;
  const LicenseAttachmentIsLoading = isLoading;
  const LicenseAttachmentError: any = error;
  const LicenseAttachmentIsSuccess = isSuccess;
  const LicenseAttachmentReset = reset;

  return {
    LicenseAttachmentMutate,
    LicenseAttachmentReset,
    LicenseAttachmentIsLoading,
    LicenseAttachmentError,
    LicenseAttachmentIsSuccess,
  };
}
