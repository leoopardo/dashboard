/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { PartnerResponsiblesBody } from "@src/services/types/register/partners/responsibles/responsibles.interface";
import { useMutation } from "react-query";

export function useUpdatePartnerResponsible(
  body: PartnerResponsiblesBody
) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    PartnerResponsiblesBody | null | undefined
  >("UpdatePartnerResponsible", async () => {
    const response = await api.put("core/partner/responsible/update", body, {});
    await queryClient.refetchQueries({ queryKey: ["PartnerResponsibles"] });
    return response.data;
  });

  const UpdatePartnerResponsibleMutate = mutate;
  const UpdatePartnerResponsibleIsLoading = isLoading;
  const UpdatePartnerResponsibleError: any = error;
  const UpdatePartnerResponsibleIsSuccess = isSuccess;
  const UpdatePartnerResponsibleReset = reset;

  return {
    UpdatePartnerResponsibleMutate,
    UpdatePartnerResponsibleIsLoading,
    UpdatePartnerResponsibleError,
    UpdatePartnerResponsibleIsSuccess,
    UpdatePartnerResponsibleReset,
  };
}
