import { queryClient } from "@src/services/queryClient";
import { AggregatorUsersQuery } from "@src/services/types/register/aggregators/aggregatorUsers.interface";
import { ReportsDataResponse } from "@src/services/types/reports/reports.interface";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";

export function useCreateAggregatorUsersReports(body: AggregatorUsersQuery) {
  const { isLoading, error, mutate, isSuccess, data } = useMutation<
    ReportsDataResponse | null | undefined
  >("CreateAggregatorUsersReports", async () => {
    const response = await api.post("report/csv/user/Aggregator", body, {});
    await queryClient.refetchQueries({ queryKey: ["AggregatorUserReports"] });
    return response.data;
  });

  const AggregatorUsersReportsMutate = mutate;
  const AggregatorUsersReportsIsLoading = isLoading;
  const AggregatorUsersReportsError = error;
  const AggregatorUsersReportsIsSuccess = isSuccess;
  const AggregatorUsersReportsData = data;

  return {
    AggregatorUsersReportsMutate,
    AggregatorUsersReportsIsLoading,
    AggregatorUsersReportsError,
    AggregatorUsersReportsIsSuccess,
    AggregatorUsersReportsData,
  };
}
