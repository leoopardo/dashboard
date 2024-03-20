import { queryClient } from "@src/services/queryClient";
import { OrganizationUserQuery } from "@src/services/types/register/organization/organizationUsers.interface";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";
import { ReportsDataResponse } from "@src/services/types/reports/reports.interface";

export function useCreateOrganizationCurrentAccount(
  body: OrganizationUserQuery
) {
  const { isLoading, error, mutate, isSuccess, reset, data } = useMutation<
    ReportsDataResponse | null | undefined
  >("CreateOrganizationCurrentAccounts", async () => {
    const response = await api.post(
      "core/account/",
      {
        ...body,
      },
      {}
    );
    await queryClient.refetchQueries({
      queryKey: ["OrganizationCurrentAccounts"],
    });
    return response.data;
  });

  const createCurrentAccountMutate = mutate;
  const createCurrentAccountIsLoading = isLoading;
  const createCurrentAccountError = error;
  const createCurrentAccountIsSuccess = isSuccess;
  const createCurrentAccountReset = reset;
  const createCurrentAccountData = data;

  return {
    createCurrentAccountMutate,
    createCurrentAccountIsLoading,
    createCurrentAccountError,
    createCurrentAccountIsSuccess,
    createCurrentAccountReset,
    createCurrentAccountData,
  };
}
