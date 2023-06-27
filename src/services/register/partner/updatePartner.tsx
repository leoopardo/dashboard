import { queryClient } from "@src/services/queryClient";
import { api } from "../../../config/api";
import { useMutation } from "react-query";
import { PartnerItem } from "@src/services/types/register/partners/partners.interface";

export function useUpdatePartner(body: PartnerItem) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    PartnerItem | null | undefined
  >("UpdatePartner", async () => {
    const response = await api.put("core/partner/update", body, {});
    await queryClient.refetchQueries({ queryKey: ["Partners"] });
    return response.data;
  });

  const UpdateMutate = mutate;
  const UpdateIsLoading = isLoading;
  const UpdateError = error;
  const UpdateIsSuccess = isSuccess;

  return {
    UpdateMutate,
    UpdateIsLoading,
    UpdateError,
    UpdateIsSuccess,
  };
}
