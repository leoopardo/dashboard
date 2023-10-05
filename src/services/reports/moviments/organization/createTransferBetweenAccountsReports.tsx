/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryClient } from "@src/services/queryClient";
import { OrganizationTransferBetweenAccountsQuery } from "@src/services/types/moviments/organization/transferBetweenAccounts.interface";
import { ReportsItem } from "@src/services/types/reports/reports.interface";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";

export function useCreateOrganizationTransferBetweenAccountsReports(
  body: OrganizationTransferBetweenAccountsQuery
) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    ReportsItem | null | undefined
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

  return {
    organizationTransferBetweenAccountsMutate,
    organizationTransferBetweenAccountsIsLoading,
    organizationTransferBetweenAccountsError,
    organizationTransferBetweenAccountsIsSuccess,
  };
}
