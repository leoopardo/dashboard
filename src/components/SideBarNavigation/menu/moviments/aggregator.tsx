import { MenuRouteInterface } from "..";
import { ItemInterface } from "../types/item.interface";

export function Aggregator({ permissions }: ItemInterface): MenuRouteInterface {
  return {
    //TODO permissão todas as permissões está para organização
    key: "aggregator_moviments",
    label: "aggregator_moviments",
    permission: permissions?.transactions?.paybrokers?.menu,
    children: [
      {
        key: "aggregator_transfer_between_accounts",
        label: "aggregator_transfer_between_accounts",
        path: "/moviment/aggregator_moviments/aggregator_transfer_between_accounts",
        permission:
          permissions?.transactions?.paybrokers?.manual_transactions?.menu,
      },
      {
        key: "aggregator_moviments_reports",
        label: "aggregator_moviments_reports",
        path: "/moviment/aggregator_moviments/aggregator_moviments_reports/aggregator_transfer_between_accounts_reports",
        permission:
          permissions?.transactions?.paybrokers?.manual_transactions?.menu,
      },
    ],
  };
}
