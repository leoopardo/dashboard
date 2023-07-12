import { queryClient } from "@src/services/queryClient";
import { MerchantBankStatementTotalsQuery } from "@src/services/types/consult/merchant/bankStatement";
import moment from "moment";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";

export function useCreateMerchantBankStatementReports(
  body: MerchantBankStatementTotalsQuery
) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    MerchantBankStatementTotalsQuery | null | undefined
  >("CreateBankStatementReports", async () => {
    const response = await api.post(
      "account/report/merchant-account/transactions/csv",
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
      queryKey: ["ConsultMerchantReports"],
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
