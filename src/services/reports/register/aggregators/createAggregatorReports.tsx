import { queryClient } from "@src/services/queryClient";
import { AggregatorQuery } from "@src/services/types/register/aggregators/aggregators.interface";
import { ReportsDataResponse } from "@src/services/types/reports/reports.interface";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";

export function useCreateAggregatorReports(body: AggregatorQuery) {
  const { isLoading, error, mutate, isSuccess, reset, data } = useMutation<
    ReportsDataResponse | null | undefined
  >("CreateAggregatorReports", async () => {
    const response = await api.post("report/csv/aggregator", body, {});
    await queryClient.refetchQueries({ queryKey: ["AggregatorReports"] });
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
