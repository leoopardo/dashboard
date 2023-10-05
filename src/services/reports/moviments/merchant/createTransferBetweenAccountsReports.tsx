/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryClient } from "@src/services/queryClient";
import { OrganizationTransferBetweenAccountsQuery } from "@src/services/types/moviments/organization/transferBetweenAccounts.interface";
import { ReportsItem } from "@src/services/types/reports/reports.interface";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";

export function useCreateMerchantTransferBetweenAccountsReports(
  body: OrganizationTransferBetweenAccountsQuery
) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    ReportsItem | null | undefined
  >("CreateMerchantTransferBetweenAccountsReports", async () => {
    const response = await api.post(
      "core/csv/merchant/account/balance/transfer",
      {
        ...body,
      },
      { params: body }
    );
    await queryClient.refetchQueries({
      queryKey: ["MerchantTransferBetweenAccountsReports"],
    });
    return response.data;
  });

  const MerchantTransferBetweenAccountsMutate = mutate;
  const MerchantTransferBetweenAccountsIsLoading = isLoading;
  const MerchantTransferBetweenAccountsError: any = error;
  const MerchantTransferBetweenAccountsIsSuccess = isSuccess;

  return {
    MerchantTransferBetweenAccountsMutate,
    MerchantTransferBetweenAccountsIsLoading,
    MerchantTransferBetweenAccountsError,
    MerchantTransferBetweenAccountsIsSuccess,
  };
}
