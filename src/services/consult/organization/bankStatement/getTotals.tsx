import moment from "moment";
import { api } from "../../../../config/api";
import { useQuery } from "react-query";
import {
  OrganizationBankStatementTotalsQuery,
  OrganizationBankStatementTotalsResponse,
} from "@src/services/types/consult/organization/bankStatement/totals.interface";

export function useGetOrganizationBankStatementTotals(
  params: OrganizationBankStatementTotalsQuery
) {
  const { data, isFetching, error, refetch } = useQuery<
    OrganizationBankStatementTotalsResponse | null | undefined
  >("organizationBankStatementTotals", async () => {
    const response = await api.get("account/report/paybrokers-account/total", {
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
    });
    return response.data;
  });

  const OrganizationBankStatementTotals = data;
  const isOrganizationBankStatementTotalsFetching = isFetching;
  const OrganizationBankStatementTotalsError: any = error;
  const refetchOrganizationBankStatementTotalsTotal = refetch;
  return {
    OrganizationBankStatementTotals,
    isOrganizationBankStatementTotalsFetching,
    OrganizationBankStatementTotalsError,
    refetchOrganizationBankStatementTotalsTotal,
  };
}
