import { MenuRouteInterface } from "..";
import { ItemInterface } from "../types/item.interface";

export function Contestation({
  permissions,
  userType,
}: ItemInterface): MenuRouteInterface {
  return {
    key: "contestation",
    label: "contestation",
    permission:
      permissions?.support?.contestation?.menu &&
      (userType === 1 || userType === 2),
    children: [
      {
        key: "uploads",
        label: "uploads",
        path: "/support/contestation/deposit_contestation/uploads",
        permission: permissions?.support?.contestation?.deposits?.menu,
      },
      {
        key: "import_csv",
        label: "import_csv",
        path: "/support/contestation/deposit_contestation/import_csv",
        permission:
          permissions?.support?.contestation?.deposits?.import_csv?.menu,
      },
    ],
  };
}
