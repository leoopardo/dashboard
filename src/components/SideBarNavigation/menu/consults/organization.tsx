import { MenuRouteInterface } from "..";
import { ItemInterface } from "../types/item.interface";

export function Organization({
  permissions,
}: ItemInterface): MenuRouteInterface {
  return {
    key: "consult_organization",
    label: "consult_organization",
    permission: permissions?.report?.paybrokers?.menu,
    children: [
      {
        key: "organization_bank_statement",
        label: "organization_bank_statement",
        path: "/consult/consult_organization/organization_bank_statement",
        permission: permissions?.report?.paybrokers?.extract?.menu,
      },
      {
        key: "organization_balance",
        label: "organization_balance",
        path: "/consult/consult_organization/organization_balance",
        permission: permissions?.report?.paybrokers?.balance?.menu,
      },
      {
        key: "organization_bank_balance",
        label: "organization_bank_balance",
        path: "/consult/consult_organization/organization_bank_balance",
        permission: permissions?.report?.paybrokers?.bank_balance?.menu,
      },
      {
        key: "organization_history",
        label: "organization_history",
        path: "/consult/consult_organization/organization_history",
        permission: permissions?.report?.paybrokers?.bank_history?.menu,
      },
      {
        key: "consult_organization_reports",
        label: "consult_organization_reports",
        path: "/consult/consult_organization/consult_organization_reports",
        permission:
          permissions?.report?.paybrokers?.extract
            ?.report_paybrokers_extract_export_csv,
      },
    ],
  };
}
