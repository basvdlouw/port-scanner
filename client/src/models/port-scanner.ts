import { Port } from "./port.js";
import { ScanResult } from "./scan-result.js";

export interface PortScanner {
  (port: Port, timeout: number): Promise<ScanResult>;
}
