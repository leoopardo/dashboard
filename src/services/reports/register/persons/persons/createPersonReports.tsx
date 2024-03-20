/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryClient } from "@src/services/queryClient";
import { PersonsQuery } from "@src/services/types/register/persons/persons.interface";
import { useMutation } from "react-query";
import { api } from "../../../../../config/api";
import { ReportsDataResponse } from "@src/services/types/reports/reports.interface";

export function useCreatePersonsReports(body: PersonsQuery) {
  const { isLoading, error, mutate, isSuccess, data } = useMutation<
    ReportsDataResponse | null | undefined
  >("CreatePersonsReports", async () => {
    const response = await api.post("customer/csv/persons", body, {
      params: body,
    });
    await queryClient.refetchQueries({ queryKey: ["PersonsReports"] });
    return response.data;
  });

  const PersonsReportsMutate = mutate;
  const PersonsReportsIsLoading = isLoading;
  const PersonsReportsError: any = error;
  const PersonsReportsIsSuccess = isSuccess;
  const PersonsReportsData = data;

  return {
    PersonsReportsMutate,
    PersonsReportsIsLoading,
    PersonsReportsError,
    PersonsReportsIsSuccess,
    PersonsReportsData,
  };
}
