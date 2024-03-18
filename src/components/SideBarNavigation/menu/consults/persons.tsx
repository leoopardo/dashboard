import { MenuRouteInterface } from "..";
import { ItemInterface } from "../types/item.interface";

export function Persons({ permissions }: ItemInterface): MenuRouteInterface {
  return {
    key: "consult_persons",
    label: "consult_persons",
    permission: permissions?.report?.person?.menu,
    children: [
      {
        key: "check_cpf",
        label: "check_cpf",
        path: "/consult/consult_persons/check_cpf",
        permission: permissions?.report?.person?.report_person_check_cpf_list,
      },
      {
        key: "historic_cpf_merchant",
        label: "historic_cpf_merchant",
        path: "/consult/consult_persons/historic_cpf_merchant",
        permission:
          permissions?.report?.person?.report_check_document_by_merchant_list,
      },
      {
        key: "serpro_assertiva",
        label: "serpro_assertiva",
        path: "/consult/consult_persons/serpro_assertiva",
        permission: permissions?.report?.person?.report_check_document_total,
      },
      {
        key: "consult_person_reports",
        label: "consult_person_reports",
        permission:
          permissions?.report?.person
            ?.report_check_document_by_merchant_export_csv,
        children: [
          //TODO permissão
          {
            key: "historic_cpf_merchant_reports",
            label: "historic_cpf_merchant_reports",
            path: "/consult/consult_persons/reports/historic_cpf_merchant",
            permission:
              permissions?.report?.person
                ?.report_check_document_by_merchant_export_csv,
          },
          {
            key: "historic_cpf_merchant_details",
            label: "historic_cpf_merchant_details",
            path: "/consult/consult_persons/reports/historic_cpf_merchant_details",
            permission:
              permissions?.report?.person
                ?.report_check_document_by_merchant_export_csv,
          },
        ],
      },
    ],
  };
}
