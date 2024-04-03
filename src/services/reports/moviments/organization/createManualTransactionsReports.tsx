import { queryClient } from "@src/services/queryClient";
import { GetMovimentsQuery } from "@src/services/types/moviments/organization/getMoviments";
import { ReportsDataResponse } from "@src/services/types/reports/reports.interface";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";

export function useCreateOrganizationManualReports(body: GetMovimentsQuery) {
  const { isLoading, error, mutate, isSuccess, data } = useMutation<
    ReportsDataResponse | null | undefined
  >("CreateOrganizationManualReports", async () => {
    const response = await api.post(
      "core/csv/organization/entry-account",
     body,
    );
    await queryClient.refetchQueries({
      queryKey: ["OrganizationManualReports"],
    });
    return response.data;
  });

  const OrganizationManualReportsMutate = mutate;
  const OrganizationManualReportsIsLoading = isLoading;
  const OrganizationManualReportsError = error;
  const OrganizationManualReportsIsSuccess = isSuccess;
  const OrganizationManualReportsData = data;

  return {
    OrganizationManualReportsMutate,
    OrganizationManualReportsIsLoading,
    OrganizationManualReportsError,
    OrganizationManualReportsIsSuccess,
    OrganizationManualReportsData,
  };
}
