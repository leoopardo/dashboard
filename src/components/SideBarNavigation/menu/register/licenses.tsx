import { MenuRouteInterface } from "..";
import { ItemInterface } from "../types/item.interface";

export function Licenses({
  permissions,
}: ItemInterface): MenuRouteInterface {
  return {
    key: "license",
    label: "license",
    permission: permissions?.register?.licenses?.menu,
    children: [
      {
        key: "licenses",
        label: "licenses",
        path: "/register/licenses",
        permission:  permissions?.register?.licenses?.menu,
      },
      {
        key: "licenses_reports",
        label: "reports",
        path: "/register/licenses/reports/licenses_reports",
        permission: permissions?.register?.licenses?.licenses?.license_export_csv,
      },

    ],
  };
}
