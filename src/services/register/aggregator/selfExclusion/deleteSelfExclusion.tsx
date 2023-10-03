import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { useMutation } from "react-query";

export function useDeleteSelfExclusion(id?: string) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    { _id: string } | null | undefined
  >("deleteSelfExclusion", async () => {
    const response = await api.delete("blacklist/self-exclusion", {
      data: { _id: id },
    });
    await queryClient.refetchQueries({ queryKey: ["selfExclusion"] });
    return response.data;
  });

  const deleteSelfExclusionMutate = mutate;
  const deleteSelfExclusionIsLoading = isLoading;
  const deleteSelfExclusionError = error;
  const deleteSelfExclusionIsSuccess = isSuccess;

  return {
    deleteSelfExclusionMutate,
    deleteSelfExclusionIsLoading,
    deleteSelfExclusionError,
    deleteSelfExclusionIsSuccess,
  };
}
