/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryClient } from "@src/services/queryClient";
import { MerchantTransferBetweenAccountsQuery } from "@src/services/types/moviments/merchant/transferBetweenAccounts.interface";
import { ReportsDataResponse } from "@src/services/types/reports/reports.interface";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";

export function useCreateMerchantTransferBetweenAccountsReports(
  body: MerchantTransferBetweenAccountsQuery
) {
  const { isLoading, error, mutate, isSuccess, data } = useMutation<
  ReportsDataResponse | null | undefined
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
  const MerchantTransferBetweenAccountsData = data;

  return {
    MerchantTransferBetweenAccountsMutate,
    MerchantTransferBetweenAccountsIsLoading,
    MerchantTransferBetweenAccountsError,
    MerchantTransferBetweenAccountsIsSuccess,
    MerchantTransferBetweenAccountsData,
  };
}
