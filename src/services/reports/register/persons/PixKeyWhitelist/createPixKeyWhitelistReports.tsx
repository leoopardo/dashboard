import { queryClient } from "@src/services/queryClient";
import { PixKeyWhitelistQuery } from "@src/services/types/register/persons/blacklist/pixKeyWhitelist.interface";
import { useMutation } from "react-query";
import { api } from "../../../../../config/api";

export function useCreatePixKeyWhitelistReports(body: PixKeyWhitelistQuery) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    PixKeyWhitelistQuery | null | undefined
  >("CreatePixKeyWhitelistReports", async () => {
    const response = await api.post(
      "blacklist/pix-key-white-list/csv",
      body,
      {}
    );
    await queryClient.refetchQueries({ queryKey: ["PixKeyWhitelistReports"] });
    return response.data;
  });

  const PixKeyWhitelistReportsMutate = mutate;
  const PixKeyWhitelistReportsIsLoading = isLoading;
  const PixKeyWhitelistReportsError = error;
  const PixKeyWhitelistReportsIsSuccess = isSuccess;

  return {
    PixKeyWhitelistReportsMutate,
    PixKeyWhitelistReportsIsLoading,
    PixKeyWhitelistReportsError,
    PixKeyWhitelistReportsIsSuccess,
  };
}
