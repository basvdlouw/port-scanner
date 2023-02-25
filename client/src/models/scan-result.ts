import { type Measurement } from "./measurement.js";
import { type Port } from "./port.js";

export interface ScanResult {
  measurement: Measurement;
  port: Port;
}
