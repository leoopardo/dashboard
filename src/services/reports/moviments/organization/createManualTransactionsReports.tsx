import { queryClient } from "@src/services/queryClient";
import { api } from "../../../../config/api";
import { useMutation } from "react-query";
import { GetMovimentsQuery } from "@src/services/types/moviments/organization/getMoviments";
import moment from "moment";

export function useCreateOrganizationManualReports(body: GetMovimentsQuery) {
  delete body.limit;
  delete body.page;
  delete body.sort_field;
  delete body.sort_order;
  const { isLoading, error, mutate, isSuccess } = useMutation<
    GetMovimentsQuery | null | undefined
  >("CreateOrganizationManualReports", async () => {
    const response = await api.post(
      "core/csv/organization/entry-account",
      {
        ...body,
        start_date: body.start_date
          ? moment(body.start_date)
              .add(3, "hours")
              .format("YYYY-MM-DDTHH:mm:ss.SSS")
          : null,
        end_date: body.end_date
          ? moment(body.end_date)
              .add(3, "hours")
              .format("YYYY-MM-DDTHH:mm:ss.SSS")
          : null,
      },
      {}
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

  return {
    OrganizationManualReportsMutate,
    OrganizationManualReportsIsLoading,
    OrganizationManualReportsError,
    OrganizationManualReportsIsSuccess,
  };
}
