import { queryClient } from "@src/services/queryClient";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";

export interface DeletePixKeyWhitelist {
  pix_key?: string;
}

export function useDeleteDeletePixKey(params?: DeletePixKeyWhitelist) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    DeletePixKeyWhitelist | null | undefined
  >("deletePixKeyWhitelist", async () => {
    const response = await api.delete("blacklist/pix-key-white-list", {
      params,
    });
    await queryClient.refetchQueries({ queryKey: ["PixKeyWhitelist"] });
    return response.data;
  });

  const DeletePixKeyMutate = mutate;
  const DeletePixKeyIsLoading = isLoading;
  const DeletePixKeyError = error;
  const DeletePixKeyIsSuccess = isSuccess;

  return {
    DeletePixKeyMutate,
    DeletePixKeyIsLoading,
    DeletePixKeyError,
    DeletePixKeyIsSuccess,
  };
}
