import { CreateManualTransaction } from "@src/services/types/moviments/organization/createManualTransaction.interface";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";
import { queryClient } from "../../../queryClient";

export function useCreateManualTransaction(
  body: CreateManualTransaction | null
) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    CreateManualTransaction | null | undefined
  >("createMerchantManualMoviment", async () => {
    const response = await api.post(
      "core/entry-account/organization/create",
      body,
      {}
    );
    await queryClient.refetchQueries({ queryKey: ["OrganizationMoviments"] });
    return response.data;
  });

  return {
    isLoading,
    error,
    mutate,
    isSuccess,
    reset
  };
}
