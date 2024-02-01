/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { PartnerAttachmentsItem } from "@src/services/types/register/partners/attachments/aggregatorAttachments.interface";
import { useMutation } from "react-query";

export function useDeleteLicenseAttachment(id: string) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    PartnerAttachmentsItem | null | undefined
  >("deleteLicenseAttachment", async () => {
    const response = await api.delete(`core/license/files/delete/${id}`, {});
    await queryClient.refetchQueries({ queryKey: ["LicensesAttachments"] });
    return response.data;
  });

  const DeleteLicenseAttachmentMutate = mutate;
  const DeleteLicenseAttachmentIsLoading = isLoading;
  const DeleteLicenseAttachmentError: any = error;
  const DeleteLicenseAttachmentIsSuccess = isSuccess;
  const DeleteLicenseAttachmentReset = reset;

  return {
    DeleteLicenseAttachmentMutate,
    DeleteLicenseAttachmentReset,
    DeleteLicenseAttachmentIsLoading,
    DeleteLicenseAttachmentError,
    DeleteLicenseAttachmentIsSuccess,
  };
}
