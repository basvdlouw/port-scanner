import { Measurement } from "../models/measurement.js";
import { Port } from "../models/port.js";
import { PortScanner } from "../models/port-scanner.js";
import { PortStatus } from "../models/port-status.js";
import { ScanResult } from "../models/scan-result.js";

export const fetchApiScan: PortScanner = async (
  port: Port,
  timeout: number
): Promise<ScanResult> => {
  const controller = new AbortController();
  const timeoutReference = setTimeout(() => {
    controller.abort();
    port.status = PortStatus.TIMEOUT;
  }, timeout);

  const options: RequestInit = {
    mode: "no-cors",
    signal: controller.signal
  };

  let end: number;
  let receivedData = false;
  const timedOut = false;

  const start = performance.now();
  const beginScan = new Date();
  let endScan = null;
  try {
    const response = await fetch(
      `http://${port.ipaddress}:${port.number}`,
      options
    );
    end = performance.now() - start;
    endScan = new Date();
    receivedData = true;
    port.status = PortStatus.OPEN;
    console.log(
      // Because of no-cors mode we cannot view response details, but it makes detection of open HTTP ports a lot easier
      `PORT: ${port.number} received response with status: ${
        response.status
      }, status text: ${
        response.statusText
      }, text: ${await response.text()}, headers: ${JSON.stringify(
        response.headers
      )}`
    );
  } catch (error) {
    end = performance.now() - start;
    console.log(
      `PORT: ${port.number} had error: ${error}. Scan took: ${end} ms`
    );
  } finally {
    clearTimeout(timeoutReference);
  }

  const measurement: Measurement = {
    startTimeOfScan: beginScan,
    endTimeOfScan: endScan,
    duration: end,
    timedOut,
    receivedData
  };

  if (end >= timeout) {
    measurement.timedOut = true;
  }

  const result: ScanResult = { port, measurement };
  return result;
};
