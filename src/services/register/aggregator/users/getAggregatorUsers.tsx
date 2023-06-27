import { api } from "@config/api";
import {
  AggregatorUsersQuery,
  AggregatorsUsersResponse,
} from "@src/services/types/register/aggregators/aggregatorUsers.interface";
import { useQuery } from "react-query";

export function useGetAggregatorUsers(params: AggregatorUsersQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    AggregatorsUsersResponse | null | undefined
  >("aggregatorUser", async () => {
    const response = await api.get("core/user/aggregator", {
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
