/* eslint-disable @typescript-eslint/no-explicit-any */
import { OrganizationPerBankItem } from "@src/services/types/consult/organization/bankStatement/perBank";
import { OrganizationBankStatementTotalsQuery } from "@src/services/types/consult/organization/bankStatement/totals.interface";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetOrganizationPerbank(
  params: OrganizationBankStatementTotalsQuery
) {
  const { data, isFetching, error, refetch } = useQuery<
    OrganizationPerBankItem[] | null | undefined
  >("organizationPerbank", async () => {
    const response = await api.get(
      "account/report/paybrokers-account/total/per-bank",
      {
        params,
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
