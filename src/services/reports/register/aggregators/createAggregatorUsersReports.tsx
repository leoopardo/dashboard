import { queryClient } from "@src/services/queryClient";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";
import { AggregatorUsersQuery } from "@src/services/types/register/aggregators/aggregatorUsers.interface";

export function useCreateAggregatorUsersReports(body: AggregatorUsersQuery) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    AggregatorUsersQuery | null | undefined
  >("CreateAggregatorUsersReports", async () => {
    const response = await api.post("report/csv/user/Aggregator", body, {
      params: body,
    });
    await queryClient.refetchQueries({ queryKey: ["AggregatorUserReports"] });
    return response.data;
  });

  const AggregatorUsersReportsMutate = mutate;
  const AggregatorUsersReportsIsLoading = isLoading;
  const AggregatorUsersReportsError = error;
  const AggregatorUsersReportsIsSuccess = isSuccess;

  return {
    AggregatorUsersReportsMutate,
    AggregatorUsersReportsIsLoading,
    AggregatorUsersReportsError,
    AggregatorUsersReportsIsSuccess,
  };
}
