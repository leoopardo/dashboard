import { queryClient } from "@src/services/queryClient";
import { ReportsQuery } from "@src/services/types/reports/reports.interface";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";

export function useCreateSelfExclusionReports(body: ReportsQuery) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
  ReportsQuery | null | undefined
  >("CreateSelfExclusionReports", async () => {
    const response = await api.post("blacklist/self-exclusion/csv", body, {
      params: body,
    });
    await queryClient.refetchQueries({ queryKey: ["SelfExclusion"] });
    return response.data;
  });

  const SelfExclusionReportsMutate = mutate;
  const SelfExclusionReportsIsLoading = isLoading;
  const SelfExclusionReportsError = error;
  const SelfExclusionReportsIsSuccess = isSuccess;

  return {
    SelfExclusionReportsMutate,
    SelfExclusionReportsIsLoading,
    SelfExclusionReportsError,
    SelfExclusionReportsIsSuccess,reset
  };
}
