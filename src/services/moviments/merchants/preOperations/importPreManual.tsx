import { api } from "@src/config/api";
import { useMutation } from "react-query";

export function useImportPreManualTransaction(
  body: {content?: string} | null
) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    { content: string } | null | undefined
  >("importPreManual", async () => {
    const response = await api.post("core/pre-entry-account/bulk/create", body, {});
    return response.data;
  });


  return {
    mutate,
    error,
    isSuccess,
    isLoading,
  };
}
