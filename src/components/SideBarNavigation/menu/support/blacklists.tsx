import { MenuRouteInterface } from "..";
import { ItemInterface } from "../types/item.interface";

export function Blacklists({ permissions }: ItemInterface): MenuRouteInterface {
  return {
    key: "blacklists",
    label: "blacklists",
    permission: permissions?.support?.blacklist?.menu,
    children: [
      {
        key: "bank_institutions",
        label: "bank_institutions",
        path: "/support/blacklists/bank_institutions",
        permission: permissions?.support?.blacklist?.banks?.menu,
      },
      {
        key: "third_parties_pix_key",
        label: "third_parties_pix_key",
        path: "/support/blacklists/third_parties_pix_key",
        permission: permissions?.support?.blacklist?.third_party_pix_keys?.menu,
      },
      {
        key: "invalid_pix_key",
        label: "invalid_pix_key",
        path: "/support/blacklists/invalid_pix_key",
        permission: permissions?.support?.blacklist?.invalid_pix_keys?.menu,
      },
      {
        key: "blacklists_reports",
        label: "blacklists_reports",
        permission:
          permissions?.support?.blacklist?.banks
            ?.support_blacklist_bank_export_csv,
        children: [
          {
            key: "bank_institutions_reports",
            label: "bank_institutions_reports",
            path: "/support/blacklists/blacklists_reports/bank_institutions_reports",
            permission:
              permissions?.support?.blacklist?.banks
                ?.support_blacklist_bank_export_csv,
          },
        ],
      },
    ],
  };
}
