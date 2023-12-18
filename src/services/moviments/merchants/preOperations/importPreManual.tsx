import { api } from "@src/config/api";
import { useMutation } from "react-query";
import secureLocalStorage from "react-secure-storage";

export function useImportPreManualTransaction(
  body: { content?: string } | null
) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    { content: string } | null | undefined
  >("importPreManual", async () => {
    const response = await api.post(
      "/core/pre-entry-account/bulk/create",
      body,
      {
        headers: {
          Authorization: `Bearer ${
            secureLocalStorage.getItem("token") ||
            sessionStorage.getItem("token")
          }`,
        },
      }
    );
    return response.data;
  });

  return {
    mutate,
    error,
    isSuccess,
    isLoading,
  };
}
