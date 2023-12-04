export interface ProfileInterface {
  id: number;
  name: string;
  created_at: string;
}

export interface PermissionsGroupsItemInterface {
  id: number;
  name: string;
  description: string;
  status: number;
  profile_name: string;
  linked_user_total: number;
}

export interface PermissionsGroupsDataInterface {
  total: number;
  page: number;
  limit: number;
  permission_groups: PermissionsGroupsItemInterface[];
}

export interface PermissionsGroupsQueryInterface {
  search?: string; //nome do groupo ou descrição
  profiles?: number[]; //id dos profiles selecionados
  status?: boolean; //status "true" | "false"
  sort_field?: string; //campo de ordenação (id | name | created_at | description | status | profile | users_total)
  sort_order?: string; //ordem de ordenação
  page?: number; //pagina
  limit?: number; //itens exibidos por página
}

export interface PermissionGroupBodyInterface {
  name?: string;
  profile_id?: number;
  status?: string;
  description?: string; //opcional
}
