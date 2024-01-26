import { queryClient } from "@src/services/queryClient";
import { useMutation } from "react-query";
import { api } from "@src/config/api";

export function useUpdateMerchantAccount(body: {merchant_id: number, account_id: number}) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
  {merchant_id: number, account_id: number} | null | undefined
  >("UpdatePartner", async () => {
    const response = await api.put("core/merchant/config/account/update", body, {});
    await queryClient.refetchQueries({ queryKey: ["OrganizationCurrentAccounts"] });
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