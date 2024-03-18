
import { MenuRouteInterface } from "..";
import { ItemInterface } from "../types/item.interface";

export function Partners({
  permissions,
}: ItemInterface): MenuRouteInterface {
  return {
    key: "partner",
    label: "partner",
    permission: permissions?.register?.partner?.menu,
    children: [
      {
        key: "partners",
        label: "partners",
        path: "/register/partner/partners",
        permission: permissions?.register?.partner?.partner?.menu,
      },
      {
        key: "partner_users",
        label: "partner_users",
        path: "/register/partner/partner_users",
        permission: permissions?.register?.partner?.users?.menu,
      },

      {
        key: "partner_reports",
        label: "partner_reports",
        permission: permissions?.register?.partner?.partner?.partner_export_csv ||
        permissions?.register?.partner?.users?.partner_user_export_csv,
        children: [
          {
            key: "partner_partners_reports",
            label: "partner_partners_reports",
            path: "/register/partner/partner_reports/partner_partners_reports",
            permission: permissions?.register?.partner?.partner
            ?.partner_export_csv,
          },
          {
            key: "partner_users_reports",
            label: "partner_users_reports",
            path: "/register/partner/partner_reports/partner_users_reports",
            permission: permissions?.register?.partner?.users
            ?.partner_user_export_csv,
          },
        ],
      },
    ],
  };
}
