import { MenuRouteInterface } from "..";
import { ItemInterface } from "../types/item.interface";

export function Organization({
  permissions,
}: ItemInterface): MenuRouteInterface {
  return {
    key: "organization_moviments",
    label: "organization_moviments",
    permission: permissions?.transactions?.paybrokers?.menu,
    children: [
      {
        key: "organization_manual_moviments",
        label: "organization_manual_moviments",
        path: "/moviment/organization_moviments/organization_manual_moviments",
        permission:
          permissions?.transactions?.paybrokers?.manual_transactions?.menu,
      },
      // TODO opermissão
      {
        key: "organization_transfer_between_accounts",
        label: "organization_transfer_between_accounts",
        path: "/moviment/organization_moviments/organization_transfer_between_accounts",
        permission:
          permissions?.transactions?.paybrokers?.manual_transactions?.menu,
      },
      {
        key: "organization_moviments_reports",
        label: "organization_moviments_reports",
        permission:
          permissions?.transactions?.paybrokers?.manual_transactions
            ?.paybrokers_manual_transactions_export_csv,
        children: [
          {
            key: "organization_manual_moviments_reports",
            label: "organization_manual_moviments_reports",
            path: "/moviment/organization_moviments/organization_moviments_reports/organization_manual_moviments_reports",
            permission:
              permissions?.transactions?.paybrokers?.manual_transactions
                ?.paybrokers_manual_transactions_export_csv,
          },
          // TODO opermissão
          {
            key: "organization_transfer_between_accounts_reports",
            label: "organization_transfer_between_accounts_reports",
            path: "/moviment/organization_moviments/organization_moviments_reports/organization_transfer_between_accounts_reports",
            permission:
              permissions?.transactions?.paybrokers?.manual_transactions
                ?.paybrokers_manual_transactions_export_csv,
          },
        ],
      },
    ],
  };
}
