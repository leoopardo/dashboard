import { queryClient } from "@src/services/queryClient";
import { api } from "../../../../config/api";
import { useMutation } from "react-query";
import { OrganizationBankStatementTotalsQuery } from "@src/services/types/consult/organization/bankStatement/totals.interface";
import moment from "moment";

export function useCreateBankStatementReports(
  body: OrganizationBankStatementTotalsQuery
) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    OrganizationBankStatementTotalsQuery | null | undefined
  >("CreateBankStatementReports", async () => {
    const response = await api.post(
      "account/report/paybrokers-account/transactions/csv",
      {},
      {
        params: {
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
      }
    );
    await queryClient.refetchQueries({
      queryKey: ["ConsultOrganizationReports"],
    });
    return response.data;
  });

  const BankStatementReportsMutate = mutate;
  const BankStatementReportsIsLoading = isLoading;
  const BankStatementReportsError = error;
  const BankStatementReportsIsSuccess = isSuccess;

  return {
    BankStatementReportsMutate,
    BankStatementReportsIsLoading,
    BankStatementReportsError,
    BankStatementReportsIsSuccess,
  };
}
