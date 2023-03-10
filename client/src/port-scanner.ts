import { type Measurement } from "./models/measurement.js";
import { type Port } from "./models/port.js";
import { PortStatus } from "./models/port-status.js";
import { type ScanResult } from "./models/scan-result.js";
import { displayResults } from "./utils.js";

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

  let end = 0;
  let receivedData = false;
  const timedOut = false;

  const start = performance.now();

  fetch(`http://${port.ipaddress}:${port.number}`, options)
    .then((response) => {
      console.log(`PORT: ${port} had response: ${response}`);
      end = performance.now() - start;
      receivedData = true;
      port.status = PortStatus.OPEN;
    })
    .catch((error) => {
      console.log(`PORT: ${port} had error: ${error}`);
      end = performance.now() - start;
    })
    .finally(() => {
      clearTimeout(timeoutReference);
    });

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
