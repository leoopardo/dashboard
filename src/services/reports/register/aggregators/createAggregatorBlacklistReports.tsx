import { queryClient } from "@src/services/queryClient";
import { AggregatorBlacklistQuery } from "@src/services/types/register/aggregators/aggregatorBlacklist.interface";
import { ReportsDataResponse } from "@src/services/types/reports/reports.interface";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";

export function useCreateAggregatorBlacklistReports(body: AggregatorBlacklistQuery) {
  const { isLoading, error, mutate, isSuccess, reset, data } = useMutation<
  ReportsDataResponse | null | undefined
  >("CreateAggregatorBlacklistReports", async () => {
    const response = await api.post(
      "blacklist/aggregator-black-list/csv",
      body,
      {
        params: body,
      }
    );
    await queryClient.refetchQueries({ queryKey: ["AggregatorBlacklistReports"] });
    return response.data;
  });

  const AggregatorReportsMutate = mutate;
  const AggregatorReportsIsLoading = isLoading;
  const AggregatorReportsError = error;
  const AggregatorReportsIsSuccess = isSuccess;
  const AggregatorReset = reset;
  const AggregatorReportsData = data;
  return {
    AggregatorReportsMutate,
    AggregatorReportsIsLoading,
    AggregatorReportsError,
    AggregatorReportsIsSuccess,
    AggregatorReset,
    AggregatorReportsData,
  };
}
