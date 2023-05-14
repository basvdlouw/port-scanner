import { type Port } from "./models/port.js";
import { PortStatus } from "./models/port-status.js";
import { type ScanResult } from "./models/scan-result.js";
import { displayResults } from "./utils.js";
import { PortScanner } from "./models/port-scanner.js";

export async function analyzePort(
  port: Port,
  timeout: number,
  numberOfScans: number,
  portScanner: PortScanner
): Promise<ScanResult[]> {
  const promises: Array<Promise<ScanResult>> = [];

  for (let i = 0; i < numberOfScans; i++) {
    promises.push(portScanner(port, timeout));
  }

  const results = await Promise.all(promises);
  const measurements = results.map((result) => result.measurement);
  const openPorts = results
    .filter((result) => result.port.status === PortStatus.OPEN)
    .map((result) => result.port);

  if (openPorts.length > 0) {
    port.status = PortStatus.OPEN;
  } else {
    port.status = PortStatus.UNKNOWN;
  }

  displayResults(port, measurements, numberOfScans);

  return results;
}
