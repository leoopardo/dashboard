import { queryClient } from "@src/services/queryClient";
import { useMutation } from "react-query";
import { api } from "@src/config/api";

export function useUpdateOrganizationsCurrentAccount(body: {id?: string, name?: string, locked?: boolean}) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
  {name: string, locked: boolean} | null | undefined
  >("UpdateOrganizationCurrentAccounts", async () => {
    const response = await api.put(`core/account/${body?.id}`, body, {});
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
