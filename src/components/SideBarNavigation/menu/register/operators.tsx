
import { MenuRouteInterface } from "..";
import { ItemInterface } from "../types/item.interface";

export function Operators({ permissions }: ItemInterface): MenuRouteInterface {
  return {
    key: "operator",
    label: "operator",
    permission: permissions?.register?.operator?.menu,
    children: [
      {
        key: "operators",
        label: "operators",
        path: "/register/operator/operators",
        permission: permissions?.register?.operator?.operator?.menu,
      },
      {
        key: "operator_users",
        label: "operator_users",
        path: "/register/operator/operator_users",
        permission: permissions?.register?.operator?.users?.menu,
      },

      {
        key: "operator_reports",
        label: "operator_reports",
        permission:
          permissions?.register?.operator?.operator?.operator_export_csv ||
          permissions?.register?.operator?.users?.operator_user_export_csv,
        children: [
          {
            key: "operator_operators_reports",
            label: "operator_operators_reports",
            path: "/register/operator/operator_reports/operator_operators_reports",
            permission:
              permissions?.register?.operator?.operator?.operator_export_csv,
          },
          {
            key: "operator_users_reports",
            label: "operator_users_reports",
            path: "/register/operator/operator_reports/operator_users_reports",
            permission:
              permissions?.register?.operator?.users?.operator_user_export_csv,
          },
        ],
      },
    ],
  };
}
