import { api } from "@src/config/api";
import { MerchantBlacklistItem } from "@src/services/types/register/merchants/merchantBlacklist.interface";
import { useMutation } from "react-query";
import { queryClient } from "@src/services/queryClient";

export function useCreateContestImportCsv(body: {content: string} | null) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    MerchantBlacklistItem | null | undefined
  >("CreateContestImportCsv", async () => {
    const response = await api.post("reconciliation/pix/e2e", body, {});
    await queryClient.refetchQueries({ queryKey: ["ContestImportCsv"] });
    return response.data;
  });

  return {
    isLoading,
    error,
    mutate,
    isSuccess,
  };
}
