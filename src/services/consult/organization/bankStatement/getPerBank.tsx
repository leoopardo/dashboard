import moment from "moment";
import { api } from "../../../../config/api";
import { useQuery } from "react-query";
import { OrganizationBankStatementTotalsQuery } from "@src/services/types/consult/organization/bankStatement/totals.interface";
import { OrganizationPerBankItem } from "@src/services/types/consult/organization/bankStatement/perBank";
import { queryClient } from "@src/services/queryClient";

export function useGetOrganizationPerbank(
  params: OrganizationBankStatementTotalsQuery
) {
  const { data, isFetching, error, refetch } = useQuery<
    OrganizationPerBankItem[] | null | undefined
  >("organizationPerbank", async () => {
    const response = await api.get(
      "account/report/paybrokers-account/total/per-bank",
      {
        params: {
          ...params,
          start_date: params.start_date
            ? moment(params.start_date)
                .add(3, "hours")
                .format("YYYY-MM-DDTHH:mm:ss.SSS")
            : null,
          end_date: params.end_date
            ? moment(params.end_date)
                .add(3, "hours")
                .format("YYYY-MM-DDTHH:mm:ss.SSS")
            : null,
        },
      }
    );

    return response.data;
  });

  const OrganizationPerbank = data;
  const isOrganizationPerbankFetching = isFetching;
  const OrganizationPerbankError: any = error;
  const refetchOrganizationPerbank = refetch;
  return {
    OrganizationPerbank,
    isOrganizationPerbankFetching,
    OrganizationPerbankError,
    refetchOrganizationPerbank,
  };
}
