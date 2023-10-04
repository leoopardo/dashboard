import { TransferBetweenAccountsbody } from "@src/services/types/moviments/merchant/transferBetweenAccounts.interface";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";
import { queryClient } from "../../../queryClient";

export function useCreateTransferBetweenAccounts(
  body: TransferBetweenAccountsbody | null
) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    TransferBetweenAccountsbody | null | undefined
  >("createTransferBetweenAccounts", async () => {
    const response = await api.post("core/entry-account/create", body, {});
    await queryClient.refetchQueries({ queryKey: ["MerchantMoviments"] });
    return response.data;
  });

  return {
    isLoading,
    error,
    mutate,
    isSuccess,
  };
}
