import { api } from "../../../../config/api";

import { IDepositFeeItem } from "@src/services/types/register/merchants/merchantFeePlans.interface";
import { useMutation } from "react-query";
import { queryClient } from "../../../queryClient";

export function useCreateMerchantFeePlans(body: IDepositFeeItem | null) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    IDepositFeeItem | null | undefined
  >("CreateMerchantsFeePlans", async () => {
    const response = await api.post("core/fee_plans", body, {});
    await queryClient.refetchQueries({ queryKey: ["MerchantsFeePlans"] });
    return response.data;
  });

  return {
    isLoading,
    error,
    mutate,
    isSuccess,
  };
}
