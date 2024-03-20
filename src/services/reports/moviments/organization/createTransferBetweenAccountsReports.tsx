/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryClient } from "@src/services/queryClient";
import { OrganizationTransferBetweenAccountsQuery } from "@src/services/types/moviments/organization/transferBetweenAccounts.interface";
import { ReportsDataResponse } from "@src/services/types/reports/reports.interface";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";

export function useCreateOrganizationTransferBetweenAccountsReports(
  body: OrganizationTransferBetweenAccountsQuery
) {
  const { isLoading, error, mutate, isSuccess, data } = useMutation<
    ReportsDataResponse | null | undefined
  >("CreateOrganizationTransferBetweenAccountsReports", async () => {
    const response = await api.post(
      "core/csv/organization/account/balance/transfer",
      {
        ...body,
      },
      { params: body }
    );
    await queryClient.refetchQueries({
      queryKey: ["organizationTransferBetweenAccountsReports"],
    });
    return response.data;
  });

  const organizationTransferBetweenAccountsMutate = mutate;
  const organizationTransferBetweenAccountsIsLoading = isLoading;
  const organizationTransferBetweenAccountsError: any = error;
  const organizationTransferBetweenAccountsIsSuccess = isSuccess;
  const organizationTransferBetweenAccountsData = data;

  return {
    organizationTransferBetweenAccountsMutate,
    organizationTransferBetweenAccountsIsLoading,
    organizationTransferBetweenAccountsError,
    organizationTransferBetweenAccountsIsSuccess,
    organizationTransferBetweenAccountsData,
  };
}
