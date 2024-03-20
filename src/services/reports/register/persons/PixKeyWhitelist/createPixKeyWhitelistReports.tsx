import { queryClient } from "@src/services/queryClient";
import { PixKeyWhitelistQuery } from "@src/services/types/register/persons/blacklist/pixKeyWhitelist.interface";
import { useMutation } from "react-query";
import { api } from "../../../../../config/api";
import { ReportsDataResponse } from "@src/services/types/reports/reports.interface";

export function useCreatePixKeyWhitelistReports(body: PixKeyWhitelistQuery) {
  const { isLoading, error, mutate, isSuccess, data } = useMutation<
    ReportsDataResponse | null | undefined
  >("CreatePixKeyWhitelistReports", async () => {
    const response = await api.post("blacklist/pix-key-white-list/csv", body, {
      params: body,
    });
    await queryClient.refetchQueries({ queryKey: ["PixKeyWhitelistReports"] });
    return response.data;
  });

  const PixKeyWhitelistReportsMutate = mutate;
  const PixKeyWhitelistReportsIsLoading = isLoading;
  const PixKeyWhitelistReportsError = error;
  const PixKeyWhitelistReportsIsSuccess = isSuccess;
  const PixKeyWhitelistReportsData = data;

  return {
    PixKeyWhitelistReportsMutate,
    PixKeyWhitelistReportsIsLoading,
    PixKeyWhitelistReportsError,
    PixKeyWhitelistReportsIsSuccess,
    PixKeyWhitelistReportsData,
  };
}
