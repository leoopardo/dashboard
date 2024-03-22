/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryClient } from "@src/services/queryClient";
import { AggregatorTransferBetweenAccountsQuery } from "@src/services/types/moviments/aggregator/transferBetweenAccounts.interface";
import { ReportsDataResponse } from "@src/services/types/reports/reports.interface";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";

export function useCreateAggregatorTransferBetweenAccountsReports(
  body: AggregatorTransferBetweenAccountsQuery
) {
  const { isLoading, error, mutate, isSuccess, data } = useMutation<
  ReportsDataResponse | null | undefined
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
  const AggregatorTransferBetweenAccountsData = data;

  return {
    AggregatorTransferBetweenAccountsMutate,
    AggregatorTransferBetweenAccountsIsLoading,
    AggregatorTransferBetweenAccountsError,
    AggregatorTransferBetweenAccountsIsSuccess,
    AggregatorTransferBetweenAccountsData,
  };
}
