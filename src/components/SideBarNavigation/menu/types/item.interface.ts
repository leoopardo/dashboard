import { PermissionSInterface } from "@src/services/types/validate.interface";

export interface ItemInterface {
  permissions: PermissionSInterface;
  userType?: number
}
