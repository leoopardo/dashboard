import { api } from "../../../../config/api";

import { IDepositFeePlansDetails } from "@src/services/types/register/merchants/merchantFeePlans.interface";
import { useMutation } from "react-query";
import { queryClient } from "../../../queryClient";

export function useCreateMerchantFeePlans(body: IDepositFeePlansDetails | null) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    IDepositFeePlansDetails | null | undefined
  >("CreateMerchantsFeePlansDetails", async () => {
    const response = await api.post("core/fee_plans_details", body, {});
    await queryClient.refetchQueries({ queryKey: ["MerchantsFeePlansDetails"] });
    return response.data;
  });

  return {
    isLoading,
    error,
    mutate,
    isSuccess,
  };
}
