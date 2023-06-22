import { api } from "../../../../config/api";

import { useQuery } from "react-query";
import {
  OrganizationUserQuery,
  OrganizationUserResponse,
} from "../../../types/register/organization/organizationUsers.interface";

export function useGetRowsOrganizationUsers(params: OrganizationUserQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    OrganizationUserResponse | null | undefined
  >(
    "OrganizationUser",
    async () => {
      const response = await api.get("core/user/organization", {
        params,
      });
      return response.data;
    },
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
    }
  );

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
