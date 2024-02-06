import { queryClient } from "@src/services/queryClient";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";
import { AggregatorQuery } from "@src/services/types/register/aggregators/aggregators.interface";

export function useCreateAggregatorReports(body: AggregatorQuery) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    AggregatorQuery | null | undefined
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
  return {
    AggregatorReportsMutate,
    AggregatorReportsIsLoading,
    AggregatorReportsError,
    AggregatorReportsIsSuccess,
    AggregatorReset,
  };
}
