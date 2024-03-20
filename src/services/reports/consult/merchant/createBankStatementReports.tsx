import { queryClient } from "@src/services/queryClient";
import { MerchantBankStatementTotalsQuery } from "@src/services/types/consult/merchant/bankStatement";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";
import { ReportsDataResponse } from "@src/services/types/reports/reports.interface";

export function useCreateMerchantBankStatementReports(
  body: MerchantBankStatementTotalsQuery
) {
  const { isLoading, error, mutate, isSuccess, data } = useMutation<
  ReportsDataResponse | null | undefined
  >("CreateBankStatementReports", async () => {
    const response = await api.post(
      "account/report/merchant-account/transactions/csv",
      {},
      {
        params: {
          ...body,
        },
      }
    );
    await queryClient.refetchQueries({
      queryKey: ["ConsultMerchantReports"],
    });
    return response.data;
  });

  const BankStatementReportsMutate = mutate;
  const BankStatementReportsIsLoading = isLoading;
  const BankStatementReportsError = error;
  const BankStatementReportsIsSuccess = isSuccess;
  const BankStatementReportsData = data;

  return {
    BankStatementReportsMutate,
    BankStatementReportsIsLoading,
    BankStatementReportsError,
    BankStatementReportsIsSuccess,
    BankStatementReportsData,
  };
}
