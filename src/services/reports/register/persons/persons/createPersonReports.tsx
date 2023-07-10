import { queryClient } from "@src/services/queryClient";
import { api } from "../../../../../config/api";
import { useMutation } from "react-query";
import { PersonsQuery } from "@src/services/types/register/persons/persons.interface";

export function useCreatePersonsReports(body: PersonsQuery) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
  PersonsQuery | null | undefined
  >("CreatePersonsReports", async () => {
    const response = await api.post("customer/csv/persons", body, {});
    await queryClient.refetchQueries({ queryKey: ["PersonsReports"] });
    return response.data;
  });

  const PersonsReportsMutate = mutate;
  const PersonsReportsIsLoading = isLoading;
  const PersonsReportsError = error;
  const PersonsReportsIsSuccess = isSuccess;

  return {
    PersonsReportsMutate,
    PersonsReportsIsLoading,
    PersonsReportsError,
    PersonsReportsIsSuccess,
  };
}
