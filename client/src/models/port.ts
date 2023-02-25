import { type PortStatus } from "./port-status";

export interface Port {
  ipaddress: string;
  number: number;
  status: PortStatus;
}
