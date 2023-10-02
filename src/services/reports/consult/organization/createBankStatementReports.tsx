import { queryClient } from "@src/services/queryClient";
import { OrganizationBankStatementTotalsQuery } from "@src/services/types/consult/organization/bankStatement/totals.interface";
import moment from "moment";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";

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
