/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "react-query";
import { api } from "@src/config/api";

export function useGetLegalPersonReportFields() {
  const { data, isFetching, error, refetch } = useQuery<
    string[] | null | undefined
  >("LegalPersonsFields", async () => {
    const response = await api.get(`customer/csv/companies/fields`);
    return response.data;
  });

  const fields = data;
  const isFieldsFetching = isFetching;
  const fieldsError: any = error;
  const refetchFields = refetch;
  return {
    fields,
    isFieldsFetching,
    fieldsError,
    refetchFields,
  };
}
