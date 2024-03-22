/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@src/config/api";
import {
  PermissionSInterface,
  ValidateInterface,
} from "@src/services/types/validate.interface";
import secureLocalStorage from "react-secure-storage";
import { Consults } from "./consults/_index";
import { Moviments } from "./moviments/_index";
import { Register } from "./register/_index";
import { Support } from "./support/_index";

export interface MenuRouteInterface {
  key: React.Key;
  icon?: React.ReactNode;
  children?: MenuRouteInterface[] | null;
  disabled?: boolean;
  style?: any;
  path?: string;
  theme?: string;
  type?: any;
  onClick?: any;
  permission?: boolean;
  label?: string;
}

export async function MenuRoutes(): Promise<MenuRouteInterface[]> {
  let permissions: PermissionSInterface = {};
  let userType;
  try {
    const { data }: { data: ValidateInterface } = await api.get(
      "/core/token/validate",
      {
        headers: {
          Authorization: `Bearer ${
            secureLocalStorage.getItem("token") ??
            sessionStorage.getItem("token")
          }`,
        },
      }
    );
    permissions = data?.permissions ?? {};
    userType = data.type;
  } catch (error) {
    console.log(error);
  }

  return [
    Register({ permissions, userType }),
    Moviments({ permissions, userType }),
    Consults({ permissions, userType }),
    Support({ permissions, userType }),
  ];
}

// display: permissions?.register?.paybrokers?.general_configs
// ?.general_configs_update_adminstrative
// ? undefined
// : "none",
