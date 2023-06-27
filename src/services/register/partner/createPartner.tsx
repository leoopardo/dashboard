import { queryClient } from "@src/services/queryClient";
import { api } from "../../../config/api";
import { useMutation } from "react-query";
import { PartnerItem } from "@src/services/types/register/partners/partners.interface";

export function useCreatePartner(body: PartnerItem) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    PartnerItem | null | undefined
  >("CreatePartner", async () => {
    const response = await api.post("core/partner/create", body, {});
    await queryClient.refetchQueries({ queryKey: ["Partners"] });
    return response.data;
  });

  const PartnerMutate = mutate;
  const PartnerIsLoading = isLoading;
  const PartnerError = error;
  const PartnerIsSuccess = isSuccess;

  return {
    PartnerMutate,
    PartnerIsLoading,
    PartnerError,
    PartnerIsSuccess,
  };
}
