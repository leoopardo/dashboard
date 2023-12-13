import { TransferBetweenAccountsbody } from "@src/services/types/moviments/merchant/transferBetweenAccounts.interface";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";
import { queryClient } from "../../../queryClient";

export function useCreateTransferBetweenAccounts(
  body: TransferBetweenAccountsbody | null
) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    TransferBetweenAccountsbody | null | undefined
  >("createTransferBetweenAccounts", async () => {
    const response = await api.post("core/merchant/account/balance/transfer/create", body, {});
    await queryClient.refetchQueries({ queryKey: ["getTransferBetweenMerchantAccounts"] });
    return response.data;
  });

  return {
    isLoading,
    error,
    mutate,
    isSuccess,reset
  };
}
