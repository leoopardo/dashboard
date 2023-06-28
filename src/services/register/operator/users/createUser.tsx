import { api } from "../../../../config/api";
import { useMutation } from "react-query";
import { NewUserInterface } from "../../../../routes/private/Pages/register/organization/users/components/newUserModal";
import { queryClient } from "../../../queryClient";
import { OperatorItem } from "@src/services/types/register/operators/operators.interface";

export function useCreateOperatorUser(body: OperatorItem) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    OperatorItem | null | undefined
  >("createOperatorUser", async () => {
    const response = await api.post("core/user/create/operator", body, {});
    await queryClient.refetchQueries({ queryKey: ["OperatorUser"] });
    return response.data;
  });

  return {
    isLoading,
    error,
    mutate,
    isSuccess,
  };
}
