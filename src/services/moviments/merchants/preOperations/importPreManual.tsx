import axios from "axios";
import { useMutation } from "react-query";
import secureLocalStorage from "react-secure-storage";

export function useImportPreManualTransaction(
  body: { content?: string } | null
) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    { content: string } | null | undefined
  >("importPreManual", async () => {
    const response = await axios.post(
      "http://192.168.10.14:8081/v4/core/pre-entry-account/bulk/create",
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
