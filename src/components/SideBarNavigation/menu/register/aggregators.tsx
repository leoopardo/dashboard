import { MenuRouteInterface } from "..";
import { ItemInterface } from "../types/item.interface";

export function Aggregators({
  permissions,
}: ItemInterface): MenuRouteInterface {
  return {
    key: "aggregator",
    label: "aggregator",
    permission: permissions?.register?.aggregator?.menu,
    children: [
      {
        key: "aggregators",
        label: "aggregators",
        path: "/register/aggregator/aggregators",
        permission: permissions?.register?.aggregator?.aggregator?.menu,
      },
      {
        key: "aggregator_users",
        label: "aggregator_users",
        path: "/register/aggregator/aggregator_users",
        permission: permissions?.register?.aggregator?.users?.menu,
      },
      {
        key: "self_exclusion",
        label: "self_exclusion",
        path: "/register/aggregator/self_exclusion",
        permission: permissions?.register?.aggregator?.self_exclusion?.menu,
      },
      {
        key: "aggregator_blacklist",
        label: "aggregator_blacklist",
        permission: permissions?.register?.aggregator?.blacklist?.menu,
        children: [
          {
            key: "aggregator_blacklist_blacklist",
            label: "aggregator_blacklist_blacklist",
            path: "/register/aggregator/aggregator_blacklist/aggregator_blacklist_blacklist",
            permission: permissions?.register?.aggregator?.blacklist?.menu,
          },{
            key: "aggregator_blacklist_reasons",
            label: "aggregator_blacklist_reasons",
            path: "/register/aggregator/aggregator_blacklist/aggregator_blacklist_reasons",
            permission: permissions?.register?.aggregator?.blacklist?.menu,
          },
        ],
      },
      {
        key: "aggregator_reports",
        label: "aggregator_reports",
        permission:
          permissions?.register?.aggregator?.aggregator
            ?.aggregator_export_csv ||
          permissions?.register?.aggregator?.users
            ?.aggregator_user_export_csv ||
          permissions?.register?.aggregator?.blacklist
            ?.aggregator_blacklist_export_csv ||
          permissions?.register?.aggregator?.self_exclusion
            ?.aggregator_self_exclusion_export_csv,
        children: [
          {
            key: "aggregator_aggregators_reports",
            label: "aggregator_aggregators_reports",
            path: "/register/aggregator/aggregator_reports/aggregator_aggregators_reports",
            permission:
              permissions?.register?.aggregator?.aggregator
                ?.aggregator_export_csv,
          },
          {
            key: "aggregator_users_reports",
            label: "aggregator_users_reports",
            path: "/register/aggregator/aggregator_reports/aggregator_users_reports",
            permission:
              permissions?.register?.aggregator?.users
                ?.aggregator_user_export_csv,
          },
          {
            key: "aggregator_blacklist_reports",
            label: "aggregator_blacklist_reports",
            path: "/register/aggregator/aggregator_reports/aggregator_blacklist_reports",
            permission:
              permissions?.register?.aggregator?.blacklist
                ?.aggregator_blacklist_export_csv,
          },
          {
            key: "self_exclusion_reports",
            label: "self_exclusion_reports",
            path: "/register/aggregator/aggregator_reports/self_exclusion_reports",
            permission:
              permissions?.register?.aggregator?.self_exclusion
                ?.aggregator_self_exclusion_export_csv,
          },
        ],
      },
    ],
  };
}
