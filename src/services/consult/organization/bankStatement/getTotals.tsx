/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  OrganizationBankStatementTotalsQuery,
  OrganizationBankStatementTotalsResponse,
} from "@src/services/types/consult/organization/bankStatement/totals.interface";
import moment from "moment";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

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

  const Default: OrganizationBankStatementTotalsResponse = {
    number_in: 0,
    number_out: 0,
    number_total: 0,
    total_out: 0,
    value_in: 0,
    value_out: 0,
    value_total: 0,
    fee_in: 0,
    fee_out: 0,
    fee_total: 0,
    bank_fee_in: 0,
    bank_fee_out: 0,
    bank_fee_total: 0,
    result_in: 0,
    result_out: 0,
    result_total: 0,
  };

  const OrganizationBankStatementTotals = { ...Default, ...data };
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
