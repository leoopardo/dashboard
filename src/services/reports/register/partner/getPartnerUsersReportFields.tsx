/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetPartnerUsersReportFields() {
  const { data, isFetching, error, refetch } = useQuery<
    string[] | null | undefined
  >("PartnerUsersReportFields", async () => {
    const response = await api.get(`report/csv/user/partner/fields`);
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
