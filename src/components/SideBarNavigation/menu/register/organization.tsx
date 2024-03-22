
import { MenuRouteInterface } from "..";
import { ItemInterface } from "../types/item.interface";

export function Organization({
  permissions,
  userType,
}: ItemInterface): MenuRouteInterface {
  return {
    key: "organization",
    label: "organization",
    permission: permissions?.register?.paybrokers?.menu,
    children: [
      {
        key: "users",
        label: "users",
        path: "/register/organization/users",
        permission: permissions?.register?.paybrokers?.users?.menu,
      },
      {
        key: "categories",
        label: "categories",
        path: "/register/organization/categories",
        permission: permissions?.register?.paybrokers?.release_category?.menu,
      },
      {
        key: "current_accounts",
        label: "current_accounts",
        path: "/register/organization/current_accounts",
        permission: permissions?.register?.paybrokers?.account?.menu,
      },
      {
        key: "bank_maintain",
        label: "bank_maintain",
        path: "/register/organization/bank_maintain",
        permission: permissions?.register?.paybrokers?.banks_maintain?.menu,
      },
      {
        key: "general_configs",
        label: "general_configs",
        path: "/register/organization/general_configs",
        permission: permissions?.register?.paybrokers?.general_configs?.menu,
      },
      {
        key: "permissions_groups",
        label: "permissions_groups",
        path: "/register/organization/permissions_groups",
        permission: userType === 1,
      },
      {
        key: "organization_reports",
        label: "organization_reports",
        permission:
          permissions?.register?.paybrokers?.users
            ?.paybrokers_user_export_csv ||
          permissions.register?.paybrokers?.release_category
            ?.paybrokers_release_category_export_csv,
        children: [
          {
            key: "organization_reports_users",
            label: "organization_reports_users",
            path: "/register/organization/organization_reports/organization_reports_users",
            permission:
              permissions?.register?.paybrokers?.users
                ?.paybrokers_user_export_csv,
          },
          {
            key: "organization_reports_categories",
            label: "organization_reports_categories",
            path: "/register/organization/organization_reports/organization_reports_categories",
            permission:
              permissions?.register?.paybrokers?.release_category
                ?.paybrokers_release_category_export_csv,
          },
        ],
      },
    ],
  };
}
