import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { useMutation } from "react-query";

export function useDeleteInvalidPixKey(id?: string) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    { pix_key: string } | null | undefined
  >("deleteInvalidPixKey", async () => {
    const response = await api.delete("blacklist/pix-key-black-list", {
      params: { pix_key: id },
    });
    await queryClient.refetchQueries({ queryKey: ["InvalidPixKey"] });
    return response.data;
  });

  const deleteInvalidPixKeyMutate = mutate;
  const deleteInvalidPixKeyIsLoading = isLoading;
  const deleteInvalidPixKeyError = error;
  const deleteInvalidPixKeyIsSuccess = isSuccess;

  return {
    deleteInvalidPixKeyMutate,
    deleteInvalidPixKeyIsLoading,
    deleteInvalidPixKeyError,
    deleteInvalidPixKeyIsSuccess,
  };
}