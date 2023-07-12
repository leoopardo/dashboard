import { queryClient } from "@src/services/queryClient";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";

interface CreatePersonInterface {
  cpf: string;
}

export function useCreatePerson(body: CreatePersonInterface) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    CreatePersonInterface | null | undefined
  >("createPerson", async () => {
    const response = await api.post("customer/person", body, {});
    await queryClient.refetchQueries({ queryKey: ["Persons"] });
    return response.data;
  });

  const PersonMutate = mutate;
  const PersonIsLoading = isLoading;
  const PersonError = error;
  const PersonIsSuccess = isSuccess;

  return {
    PersonMutate,
    PersonIsLoading,
    PersonError,
    PersonIsSuccess,
  };
}
