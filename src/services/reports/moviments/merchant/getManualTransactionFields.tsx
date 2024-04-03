/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetManualTransactionReportFields() {
  const { data, isFetching, error, refetch } = useQuery<
    string[] | null | undefined
  >("ManualTransactionReportFields", async () => {
    const response = await api.get(`core/csv/merchant/entry-account/fields`);
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
