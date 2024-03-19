import { useMutation } from "react-query";
import { queryClient } from "@src/services/queryClient";
import { api } from "../../../../config/api";

export function useUpdateLegalPersonsBlacklist(body: { content: string } | null) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
  { content: string } | null | undefined
  >("UploadLegalPersonsBlacklistFile", async () => {
    const response = await api.post("customer/bulk_create/persons", body, {});
    await queryClient.refetchQueries({ queryKey: ["LegalPersonsByCnpj"] });
    return response.data;
  });

  return {
    isLoading,
    error,
    mutate,
    isSuccess,
  };
}