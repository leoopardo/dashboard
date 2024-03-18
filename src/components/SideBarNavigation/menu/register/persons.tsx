
import { MenuRouteInterface } from "..";
import { ItemInterface } from "../types/item.interface";

export function Persons({ permissions }: ItemInterface): MenuRouteInterface {
  return {
    key: "person",
    label: "person",
    permission: permissions?.register?.person?.menu,
    children: [
      {
        key: "persons",
        label: "persons",
        path: "/register/person/persons",
        permission: permissions?.register?.person?.person?.menu,
      },
      {
        key: "person_accounts",
        label: "person_accounts",
        path: "/register/person/person_accounts",
        permission: permissions?.register?.person?.client_banks?.menu,
      },
      {
        key: "person_blacklist",
        label: "person_blacklist",
        permission:
          permissions?.register?.person?.blacklist?.import_csv?.menu ||
          permissions?.register?.person?.blacklist?.reason?.menu,
        children: [
          {
            key: "upload_person_blacklist",
            label: "upload_person_blacklist",
            path: "/register/person/person_blacklist/upload_person_blacklist",
            permission:
              permissions?.register?.person?.blacklist?.import_csv?.menu,
          },
          {
            key: "person_blacklist_uploads",
            label: "person_blacklist_uploads",
            path: "/register/person/person_blacklist/person_blacklist_uploads",
            permission:
              permissions?.register?.person?.blacklist?.import_csv?.menu,
          },
          {
            key: "person_blacklist_reasons",
            label: "person_blacklist_reasons",
            path: "/register/person/person_blacklist/person_blacklist_reasons",
            permission: permissions?.register?.person?.blacklist?.reason?.menu,
          },
        ],
      },
      {
        key: "person_reports",
        label: "person_reports",
        permission:
          permissions?.register?.person?.person?.person_person_export_csv ||
          permissions?.register?.person?.client_banks
            ?.person_client_banks_export_csv,
        children: [
          {
            key: "person_persons_reports",
            label: "person_persons_reports",
            path: "/register/person/person_reports/person_persons_reports",
            permission:
              permissions?.register?.person?.person?.person_person_export_csv,
          },
          {
            key: "client_bank_reports",
            label: "client_bank_reports",
            path: "/register/person/person_reports/client_bank_reports",
            permission:
              permissions?.register?.person?.client_banks
                ?.person_client_banks_export_csv,
          },
        ],
      },
    ],
  };
}
