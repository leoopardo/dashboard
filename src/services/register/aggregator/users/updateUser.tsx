import { useMutation } from "react-query";
import { api } from "../../../../config/api";
import { NewUserInterface } from "../../../../routes/private/Pages/register/organization/users/components/newUserModal";
import { queryClient } from "../../../queryClient";

export function useUpdateAggregatorUser(body: any | null) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    NewUserInterface | null | undefined
  >("updateAggregatorUser", async () => {
    const response = await api.put("core/user/update/aggregator", body, {});
    await queryClient.refetchQueries({ queryKey: ["aggregatorUser"] });
    return response.data;
  });

  const updateLoading = isLoading;
  const updateError = error;
  const updateMutate = mutate;
  const updateSuccess = isSuccess;
  const updateReset = reset;
  return {
    updateLoading,
    updateError,
    updateMutate,
    updateSuccess,
    updateReset,
  };
}
