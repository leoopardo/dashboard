import { queryClient } from "@src/services/queryClient";
import { GetMovimentsQuery } from "@src/services/types/moviments/organization/getMoviments";
import moment from "moment";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";
import { ReportsDataResponse } from "@src/services/types/reports/reports.interface";

export function useCreateOrganizationManualReports(body: GetMovimentsQuery) {
  const { isLoading, error, mutate, isSuccess, data } = useMutation<
    ReportsDataResponse | null | undefined
  >("CreateOrganizationManualReports", async () => {
    const response = await api.post(
      "core/csv/organization/entry-account",
      {
        ...body,
        start_date: body.start_date
          ? moment(body.start_date).utc().format("YYYY-MM-DDTHH:mm:ss.SSS")
          : null,
        end_date: body.end_date
          ? moment(body.end_date).utc().format("YYYY-MM-DDTHH:mm:ss.SSS")
          : null,
      },
      { params: body }
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
