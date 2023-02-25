import { type PortStatus } from "./port-status.js";

export interface Port {
  ipaddress: string;
  number: number;
  status: PortStatus;
}
