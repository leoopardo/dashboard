import { queryClient } from "@src/services/queryClient";
import { OrganizationUserQuery } from "@src/services/types/register/organization/organizationUsers.interface";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";
import { ReportsDataResponse } from "@src/services/types/reports/reports.interface";

export function useCreateOrganizationReports(body: OrganizationUserQuery) {
  const { isLoading, error, mutate, isSuccess, data } = useMutation<
  ReportsDataResponse | null | undefined
  >("CreateOrganizationReports", async () => {
    const response = await api.post(
      "report/csv/user/organization",
      {
        ...body,
      },
      {}
    );
    await queryClient.refetchQueries({ queryKey: ["OrganizationUserReports"] });
    return response.data;
  });

  const OrganizationReportsMutate = mutate;
  const OrganizationReportsIsLoading = isLoading;
  const OrganizationReportsError = error;
  const OrganizationReportsIsSuccess = isSuccess;
  const OrganizationReportsData = data;

  return {
    OrganizationReportsMutate,
    OrganizationReportsIsLoading,
    OrganizationReportsError,
    OrganizationReportsIsSuccess,
    OrganizationReportsData,
  };
}
