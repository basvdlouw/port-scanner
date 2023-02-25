import { type Port } from "./port";

export interface Measurement {
  port: Port;
  duration: number;
  timedOut: boolean;
}
