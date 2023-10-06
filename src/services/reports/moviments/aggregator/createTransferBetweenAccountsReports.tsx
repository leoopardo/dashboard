/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryClient } from "@src/services/queryClient";
import { AggregatorTransferBetweenAccountsQuery } from "@src/services/types/moviments/aggregator/transferBetweenAccounts.interface";
import { ReportsItem } from "@src/services/types/reports/reports.interface";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";

export function useCreateAggregatorTransferBetweenAccountsReports(
  body: AggregatorTransferBetweenAccountsQuery
) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    ReportsItem | null | undefined
  >("CreateAggregatorTransferBetweenAccountsReports", async () => {
    const response = await api.post(
      "core/csv/aggregator/account/balance/transfer",
      {
        ...body,
      },
      { params: body }
    );
    await queryClient.refetchQueries({
      queryKey: ["AggregatorTransferBetweenAccountsReports"],
    });
    return response.data;
  });

  const AggregatorTransferBetweenAccountsMutate = mutate;
  const AggregatorTransferBetweenAccountsIsLoading = isLoading;
  const AggregatorTransferBetweenAccountsError: any = error;
  const AggregatorTransferBetweenAccountsIsSuccess = isSuccess;

  return {
    AggregatorTransferBetweenAccountsMutate,
    AggregatorTransferBetweenAccountsIsLoading,
    AggregatorTransferBetweenAccountsError,
    AggregatorTransferBetweenAccountsIsSuccess,
  };
}
