/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetManualOrganizationTransactionReportFields() {
  const { data, isFetching, error, refetch } = useQuery<
    string[] | null | undefined
  >("ManualOrganizationTransactionReportFields", async () => {
    const response = await api.get(`core/csv/organization/entry-account/fields`);
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
