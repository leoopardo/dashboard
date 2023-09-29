import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { useMutation } from "react-query";

export function useDeletePersonReason(id?: string) {
  const { isLoading, error, mutate, isSuccess } = useMutation<null | undefined>(
    "deleteMerchantsFeePlans",
    async () => {
      const response = await api.delete(`customer/blacklist-reason/${id}`, {});
      await queryClient.refetchQueries({ queryKey: ["PersonBlacklistReasons"] });
      return response.data;
    }
  );

  const deletePersonReasonMutate = mutate;
  const deletePersonReasonIsLoading = isLoading;
  const deletePersonReasonError = error;
  const deletePersonReasonIsSuccess = isSuccess;

  return {
    deletePersonReasonMutate,
    deletePersonReasonIsLoading,
    deletePersonReasonError,
    deletePersonReasonIsSuccess,
  };
}
