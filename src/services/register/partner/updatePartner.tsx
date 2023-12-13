import { queryClient } from "@src/services/queryClient";
import { PartnerItem } from "@src/services/types/register/partners/partners.interface";
import { useMutation } from "react-query";
import { api } from "../../../config/api";

export function useUpdatePartner(body: PartnerItem) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    PartnerItem | null | undefined
  >("UpdatePartner", async () => {
    const response = await api.put("core/partner/update", body, {});
    await queryClient.refetchQueries({ queryKey: ["Partners"] });
    return response.data;
  });

  const UpdateMutate = mutate;
  const UpdateReset = reset;
  const UpdateIsLoading = isLoading;
  const UpdateError = error;
  const UpdateIsSuccess = isSuccess;

  return {
    UpdateMutate,
    UpdateIsLoading,
    UpdateError,
    UpdateIsSuccess,UpdateReset
  };
}
