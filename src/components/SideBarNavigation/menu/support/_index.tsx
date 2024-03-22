import { NotificationOutlined } from "@ant-design/icons";
import { MenuRouteInterface } from "..";
import { ItemInterface } from "../types/item.interface";
import { Blacklists } from "./blacklists";
import { Logs } from "./logs";
import { Contestation } from "./contestation";

export function Support({
  permissions,
  userType,
}: ItemInterface): MenuRouteInterface {
  return {
    key: "support",
    label: "support",
    icon: <NotificationOutlined style={{ fontSize: "23px" }} />,
    permission: permissions?.support?.menu,
    children: [
      Blacklists({ permissions, userType }),
      Logs({ permissions, userType }),
      Contestation({ permissions, userType }),
      // {
      //   key: "Wiki",
      //   label: "Wiki",
      //   onClick: () => window.open("https://wiki-v4.paybrokers.info/"),
      //   permission: true
      // },
    ],
  };
}
