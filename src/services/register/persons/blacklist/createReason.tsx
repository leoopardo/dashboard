import { api } from "../../../../config/api";
import { PersonBlacklistReasonsItem } from "@src/services/types/register/persons/blacklist/reasons.interface";
import { useMutation } from "react-query";
import { queryClient } from "../../../queryClient";

export function useCreatePersonBlacklistReason(
  body: { reason: string } | null
) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
  PersonBlacklistReasonsItem | null | undefined
  >("CreatePersonBlacklistReason", async () => {
    const response = await api.post(
      "customer/blacklist-reason",
      body,
      {}
    );
    await queryClient.refetchQueries({ queryKey: ["PersonBlacklistReasons"] });
    return response.data;
  });

  return {
    isLoading,
    error,
    mutate,
    isSuccess,
  };
}
