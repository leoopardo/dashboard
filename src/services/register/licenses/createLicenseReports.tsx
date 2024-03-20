import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { LicenseQuery } from "@src/services/types/register/licenses/licenses.interface";
import { ReportsDataResponse } from "@src/services/types/reports/reports.interface";
import { useMutation } from "react-query";

export function useCreateLicenseReports(body: LicenseQuery) {
  const { isLoading, error, mutate, isSuccess, data } = useMutation<
  ReportsDataResponse | null | undefined
  >("CreateLicenseReports", async () => {
    const response = await api.post("report/csv/license", body, {  params: body,});
    await queryClient.refetchQueries({ queryKey: ["LicensesReports"] });
    return response.data;
  });

  const LicenseReportsMutate = mutate;
  const LicenseReportsIsLoading = isLoading;
  const LicenseReportsError = error;
  const LicenseReportsIsSuccess = isSuccess;
  const LicenseReportsData = data;

  return {
    LicenseReportsMutate,
    LicenseReportsIsLoading,
    LicenseReportsError,
    LicenseReportsIsSuccess,
    LicenseReportsData,
  };
}
