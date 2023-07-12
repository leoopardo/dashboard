import { api } from "../../../../config/api";

import {
  MerchantUsersQuery,
  MerchantUsersResponse,
} from "@src/services/types/register/merchants/merchantUsers.interface";
import { useQuery } from "react-query";

export function useGetRowsMerchantUsers(params: MerchantUsersQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    MerchantUsersResponse | null | undefined
  >("MerchantUser", async () => {
    const response = await api.get("core/user/merchant", {
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
