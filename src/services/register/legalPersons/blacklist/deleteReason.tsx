import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { useMutation } from "react-query";

export function useDeleteLegalPersonReason(id?: string) {
  const { isLoading, error, mutate, isSuccess } = useMutation<null | undefined>(
    "deleteLegalPersonReason",
    async () => {
      const response = await api.delete(`customer/blacklist-reason/${id}`, {});
      await queryClient.refetchQueries({ queryKey: ["LegalPersonBlacklistReasons"] });
      return response.data;
    }
  );

  const deleteLegalPersonReasonMutate = mutate;
  const deleteLegalPersonReasonIsLoading = isLoading;
  const deleteLegalPersonReasonError = error;
  const deleteLegalPersonReasonIsSuccess = isSuccess;

  return {
    deleteLegalPersonReasonMutate,
    deleteLegalPersonReasonIsLoading,
    deleteLegalPersonReasonError,
    deleteLegalPersonReasonIsSuccess,
  };
}
