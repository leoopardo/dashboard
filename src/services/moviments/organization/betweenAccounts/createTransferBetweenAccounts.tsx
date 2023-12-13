import { OrganizationTransferBetweenAccountsbody } from "@src/services/types/moviments/organization/transferBetweenAccounts.interface";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";
import { queryClient } from "../../../queryClient";

export function useCreateOrganizationTransferBetweenAccounts(
  body: OrganizationTransferBetweenAccountsbody | null
) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    OrganizationTransferBetweenAccountsbody | null | undefined
  >("createOrganizationTransferBetweenAccounts", async () => {
    const response = await api.post("core/organization/account/balance/transfer/create", body, {});
    await queryClient.refetchQueries({ queryKey: ["getTransferBetweenOrganizationAccounts"] });
    return response.data;
  });

  return {
    isLoading,
    error,
    mutate,
    isSuccess,reset
  };
}
