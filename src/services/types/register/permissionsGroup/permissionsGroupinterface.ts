export interface ProfileInterface {
  id: number;
  name: string;
  created_at: string;
}

export interface PermissionsGroupsItemInterface {
  id?: number;
  name?: string;
  description?: string;
  status?: number | string;
  profile_name?: string;
  linked_user_total?: number;
}

export interface PermissionsGroupsDataInterface {
  total: number;
  page: number;
  limit: number;
  permission_groups: PermissionsGroupsItemInterface[];
}

export interface PermissionsGroupsQueryInterface {
  search?: string;
  profiles?: number[];
  status?: boolean;
  sort_field?: string;
  sort_order?: string;
  page?: number;
  limit?: number;
}

export interface PermissionGroupBodyInterface {
  name?: string;
  profile_id?: number;
  status?: string | number | boolean;
  description?: string;
  group_id?: number;
}

export interface PermissionMenuInterface {
  id: number;
  name: string;
  menu_id: number;
  internal_id: string;
  permissions: [
    {
      id: number;
      internal_id: string;
      permission: string;
      permission_type: {
        name: string;
      };
    }
  ];
  menu_id_children: PermissionMenuInterface[];
}

export interface PermissionGroupInterface {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  description: string;
  status: number;
  profile_type: {
    id: number;
    name: string;
  };
  permissions: {
    id: number;
    internal_id: string;
    permission: string;
  }[];
}
