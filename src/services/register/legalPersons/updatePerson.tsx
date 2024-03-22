import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { LegalPersonsItem } from "@src/services/types/register/legalPersons/persons.interface";
import { PersonsItem } from "@src/services/types/register/persons/persons.interface";
import { useMutation } from "react-query";

export function useUpdateLegalPerson(
  body: PersonsItem | null | undefined,
  cnpj: string | undefined
) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    LegalPersonsItem | null | undefined
  >("UpdateLegalPerson", async () => {
    const response = await api.put(`customer/company/${cnpj}`, body, {});
    await queryClient.refetchQueries({ queryKey: ["LegalPersonsByCnpj"] });
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
