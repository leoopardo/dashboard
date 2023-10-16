/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { PartnerResponsiblesBody } from "@src/services/types/register/partners/responsibles/responsibles.interface";
import { useMutation } from "react-query";

export function useCreatePartnerResponsible(
  body: PartnerResponsiblesBody
) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    PartnerResponsiblesBody | null | undefined
  >("CreatePartnerResponsible", async () => {
    const response = await api.post("core/partner/responsible/create", body, {});
    await queryClient.refetchQueries({ queryKey: ["PartnerResponsibles"] });
    return response.data;
  });

  const PartnerResponsibleMutate = mutate;
  const PartnerResponsibleIsLoading = isLoading;
  const PartnerResponsibleError: any = error;
  const PartnerResponsibleIsSuccess = isSuccess;
  const PartnerResponsibleReset = reset;

  return {
    PartnerResponsibleMutate,
    PartnerResponsibleIsLoading,
    PartnerResponsibleError,
    PartnerResponsibleIsSuccess,
    PartnerResponsibleReset,
  };
}
