import { api } from "../../../../config/api";
import { PersonBlacklistReasonsItem } from "@src/services/types/register/persons/blacklist/reasons.interface";
import { useMutation } from "react-query";
import { queryClient } from "../../../queryClient";

export function useCreateLegalPersonBlacklistReason(
  body: { reason: string } | null
) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
  PersonBlacklistReasonsItem | null | undefined
  >("CreateLegalPersonBlacklistReason", async () => {
    const response = await api.post(
      "customer/blacklist-reason",
      body,
      {}
    );
    await queryClient.refetchQueries({ queryKey: ["LegalPersonBlacklistReasons"] });
    return response.data;
  });

  return {
    isLoading,
    error,
    mutate,
    isSuccess,
  };
}
