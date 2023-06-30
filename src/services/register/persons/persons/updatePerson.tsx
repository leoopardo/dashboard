import { queryClient } from "@src/services/queryClient";
import { api } from "../../../../config/api";
import { useMutation } from "react-query";
import { PersonsItem } from "@src/services/types/register/persons/persons.interface";

export function useUpdatePerson(
  body: PersonsItem | undefined,
  cpf: string | undefined
) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    PersonsItem | null | undefined
  >("UpdatePerson", async () => {
    const response = await api.put(`customer/persons/${cpf}`, body, {});
    await queryClient.refetchQueries({ queryKey: ["Persons"] });
    return response.data;
  });

  const UpdateMutate = mutate;
  const UpdateIsLoading = isLoading;
  const UpdateError = error;
  const UpdateIsSuccess = isSuccess;

  return {
    UpdateMutate,
    UpdateIsLoading,
    UpdateError,
    UpdateIsSuccess,
  };
}
