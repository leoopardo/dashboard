/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import {
  PartnerUsersQuery,
  PartnersUsersResponse,
} from "@src/services/types/register/partners/partnerUsers.interface";
import { useQuery } from "react-query";

export function useGetPartnerUsers(params: PartnerUsersQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    PartnersUsersResponse | null | undefined
  >("partnerUser", async () => {
    const response = await api.get("core/user/partner", {
      params,
    });
    return response.data;
  });

  const UsersData = data;
  const isUsersDataFetching = isFetching;
  const UsersDataError: any = error;
  const refetchUsersData = refetch;
  return {
    UsersData,
    isUsersDataFetching,
    UsersDataError,
    refetchUsersData,
  };
}
