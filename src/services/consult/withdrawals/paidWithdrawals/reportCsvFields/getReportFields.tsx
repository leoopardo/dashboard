/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@src/config/api";
import { useQuery } from "react-query";

export function useGetPaidWithdrawReportFields() {
  const { data, isFetching, error, refetch } = useQuery<
    string[] | null | undefined
  >("PaidWithdrawReportFields", async () => {
    const response = await api.get(`report/csv/withdraw/paid-at/fields`);
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
