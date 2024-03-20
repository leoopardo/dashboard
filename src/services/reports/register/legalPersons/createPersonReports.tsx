/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { LegalPersonsQuery } from "@src/services/types/register/legalPersons/persons.interface";
import { useMutation } from "react-query";

export function useCreateLegalPersonsReports(body: LegalPersonsQuery) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    LegalPersonsQuery | null | undefined
  >("CreateLegalPersonsReports", async () => {
    const response = await api.post("/customer/csv/companies", body, {  params: body,});
    await queryClient.refetchQueries({ queryKey: ["LegalPersonsReports"] });
    return response.data;
  });

  const PersonsReportsMutate = mutate;
  const PersonsReportsIsLoading = isLoading;
  const PersonsReportsError: any = error;
  const PersonsReportsIsSuccess = isSuccess;

  return {
    PersonsReportsMutate,
    PersonsReportsIsLoading,
    PersonsReportsError,
    PersonsReportsIsSuccess,
  };
}
