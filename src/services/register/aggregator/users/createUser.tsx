import { api } from "../../../../config/api";
import { useMutation, } from "react-query";
import { NewUserInterface } from "../../../../routes/private/Pages/register/organization/users/components/newUserModal";
import { queryClient } from "../../../queryClient";

export function useCreateAggregatorUser(body: NewUserInterface) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    NewUserInterface | null | undefined
  >("createAggregatorUser", async () => {
    const response = await api.post("core/user/create/aggregator", body, {});
    await queryClient.refetchQueries({ queryKey: ["aggregatorUser"] });
    return response.data;
  });

  return {
    isLoading,
    error,
    mutate,
    isSuccess,
    reset
  };
}
