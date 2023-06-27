import { api } from "@config/api";
import {
  OperatorUsersQuery,
  OperatorsUsersResponse,
} from "@src/services/types/register/operators/operatorUsers.interface";
import { useQuery } from "react-query";

export function useGetOperatorUsers(params: OperatorUsersQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    OperatorsUsersResponse | null | undefined
  >("OperatorUser", async () => {
    const response = await api.get("core/user/operator", {
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
