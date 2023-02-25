import { type Measurement } from "./measurement";
import { type Port } from "./port";

export interface ScanResult {
  measurement: Measurement;
  port: Port;
}
