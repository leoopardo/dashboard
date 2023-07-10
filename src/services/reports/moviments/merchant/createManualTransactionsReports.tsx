import { queryClient } from "@src/services/queryClient";
import { api } from "../../../../config/api";
import { useMutation } from "react-query";
import { GetMerchantMovimentsQuery } from "@src/services/types/moviments/merchant/getMoviments";
import moment from "moment";

export function useCreateMerchantManualReports(
  body: GetMerchantMovimentsQuery
) {
  delete body.limit;
  delete body.page;
  delete body.sort_field;
  delete body.sort_order;

  const { isLoading, error, mutate, isSuccess } = useMutation<
    GetMerchantMovimentsQuery | null | undefined
  >("CreateMerchantManualReports", async () => {
    const response = await api.post(
      "core/csv/merchant/entry-account",
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
      queryKey: ["MerchantManualReports"],
    });
    return response.data;
  });

  const MerchantManualReportsMutate = mutate;
  const MerchantManualReportsIsLoading = isLoading;
  const MerchantManualReportsError = error;
  const MerchantManualReportsIsSuccess = isSuccess;

  return {
    MerchantManualReportsMutate,
    MerchantManualReportsIsLoading,
    MerchantManualReportsError,
    MerchantManualReportsIsSuccess,
  };
}
