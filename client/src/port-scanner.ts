import { type Measurement } from "./models/measurement";
import { type Port } from "./models/port";
import { PortStatus } from "./models/port-status";
import { type ScanResult } from "./models/scan-result";
import { displayResults } from "./utils";

async function scanPort(port: Port, timeout: number): Promise<ScanResult> {
  const controller = new AbortController();
  const timeoutReference = setTimeout(() => {
    controller.abort();
    port.status = PortStatus.TIMEOUT;
    const measurement: Measurement = {
      duration: timeout,
      timedOut: true,
      receivedData: false
    };
    return { port, measurement };
  }, timeout);

  const options: RequestInit = { mode: "no-cors", signal: controller.signal };

  let end: number;
  let receivedData = false;
  const timedOut = false;

  const start = performance.now();

  try {
    await fetch(`http://${port.ipaddress}:${port.number}`, options);
    end = performance.now() - start;
    receivedData = true;
    port.status = PortStatus.OPEN;
  } catch {
    end = performance.now() - start;
  } finally {
    clearTimeout(timeoutReference);
  }

  const measurement: Measurement = {
    duration: end,
    timedOut,
    receivedData
  };

  if (end >= timeout) {
    measurement.timedOut = true;
  }

  return { port, measurement };
}

export async function analyzePort(
  port: Port,
  timeout: number,
  numberOfScans: number
): Promise<ScanResult[]> {
  const promises: Array<Promise<ScanResult>> = [];

  for (let i = 0; i < numberOfScans; i++) {
    promises.push(scanPort(port, timeout));
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
