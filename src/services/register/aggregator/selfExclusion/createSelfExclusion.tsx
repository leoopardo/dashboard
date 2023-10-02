import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { CreateSelfExclusion } from "@src/services/types/register/aggregators/selfExclusion/getSelfExclusion";
import { useMutation } from "react-query";

export function useCreateSelfExclusion(body: CreateSelfExclusion) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    CreateSelfExclusion | null | undefined
  >("CreateSelfExclusion", async () => {
    const response = await api.post("blacklist/self-exclusion", body, {});
    await queryClient.refetchQueries({ queryKey: ["selfExclusion"] });
    return response.data;
  });

  return {
    isLoading,
    error,
    mutate,
    isSuccess,
  };
}
