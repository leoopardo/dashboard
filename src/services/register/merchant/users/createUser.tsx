import { api } from "../../../../config/api";

import { MerchantUserBodyItem } from "@src/services/types/register/merchants/merchantUsers.interface";
import { useMutation } from "react-query";
import { queryClient } from "../../../queryClient";

export function useCreateMerchantUser(body: MerchantUserBodyItem) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    MerchantUserBodyItem | null | undefined
  >("CreateMerchantUserr", async () => {
    const response = await api.post("core/user/create/merchant", body, {});
    await queryClient.refetchQueries({ queryKey: ["MerchantUser"] });
    return response.data;
  });

  return {
    isLoading,
    error,
    mutate,
    isSuccess,
    reset,
  };
}
