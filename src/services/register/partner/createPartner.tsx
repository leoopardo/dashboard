import { queryClient } from "@src/services/queryClient";
import { PartnerItem } from "@src/services/types/register/partners/partners.interface";
import { useMutation } from "react-query";
import { api } from "../../../config/api";

export function useCreatePartner(body: PartnerItem) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
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
    PartnerIsSuccess,reset
  };
}
