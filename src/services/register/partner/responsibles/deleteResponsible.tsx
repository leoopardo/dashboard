/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { useMutation } from "react-query";

export function useDeletePartnerResponsible(body: {
  partner_responsible_id?: number;
}) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    { partner_responsible_id?: number } | null | undefined
  >("DeletePartnerResponsible", async () => {
    const response = await api.delete("core/partner/responsible/delete", {
      data: body,
    });
    await queryClient.refetchQueries({ queryKey: ["PartnerResponsibles"] });
    return response.data;
  });

  const DeletePartnerResponsibleMutate = mutate;
  const DeletePartnerResponsibleIsLoading = isLoading;
  const DeletePartnerResponsibleError: any = error;
  const DeletePartnerResponsibleIsSuccess = isSuccess;
  const DeletePartnerResponsibleReset = reset;

  return {
    DeletePartnerResponsibleMutate,
    DeletePartnerResponsibleIsLoading,
    DeletePartnerResponsibleError,
    DeletePartnerResponsibleIsSuccess,
    DeletePartnerResponsibleReset,
  };
}
