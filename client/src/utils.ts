import { Measurement } from "./models/measurement.js";
import { Port } from "./models/port.js";
import { PortStatus } from "./models/port-status.js";
import { fetchApiScan } from "./port-scanners/fetch-api.js";
import { websocketScan } from "./port-scanners/websocket-api.js";
import { xhrApiScan } from "./port-scanners/xhr-api.js";
import { PortScanner } from "./models/port-scanner.js";

export function portRangeIsValid(start: number, end: number): boolean {
  if (start <= 0 || end >= 65536 || start > end) return false;
  return true;
}

export function sumOfNumbersInArray(array: number[]): number {
  return array.reduce((x: number, y: number) => x + y);
}

export function displayResults(
  port: Port,
  measurements: Measurement[],
  numberOfScans: number
): void {
  if (
    port.status === PortStatus.OPEN ||
    port.status === PortStatus.LIKELY_OPEN
  ) {
    const el = document.getElementById("portScannerStatus");
    const row = document.createElement("tr");
    const x = row.insertCell(-1);
    x.innerHTML = `${port.ipaddress}:${port.number}`;

    const y = row.insertCell(-1);
    y.innerHTML = `${port.status}`;

    const n = row.insertCell(-1);
    n.innerHTML = `${numberOfScans}`;

    const open = row.insertCell(-1);
    open.innerHTML = `Scan took ${getAverageDuration(
      measurements
    )} milliseconds on average`;
    el?.appendChild(row);
  }
}

export function getAverageDuration(measurements: Measurement[]): number {
  const sum = measurements.reduce(
    (total, measurement) => total + measurement.duration,
    0
  );
  return sum / measurements.length;
}

export function sortTableByPortNumber() {
  const table = document.getElementById(
    "portScannerStatus"
  ) as HTMLTableElement;
  if (!table) return;

  const rows = Array.from(table.rows).slice(1); // exclude header row
  rows.sort((a, b) => {
    const portA = parseInt(a.cells[0].innerHTML);
    const portB = parseInt(b.cells[0].innerHTML);
    return portA - portB;
  });

  rows.forEach((row) => table.appendChild(row));
}

interface QueryParameters {
  [key: string]: string | null;
}

export function getQueryParameter(queryParameter: string): string {
  const params = new URLSearchParams(window.location.search);
  const value = params.get(queryParameter);
  if (value == null) {
    throw `Query parameter: ${queryParameter} is null`;
  }
  return value;
}

export function getScanAPI(scanningTechnique: string): PortScanner {
  let scanningAPI;

  switch (scanningTechnique) {
    case "fetch":
      scanningAPI = fetchApiScan;
      break;
    case "websocket":
      scanningAPI = websocketScan;
      break;
    case "xhr":
      scanningAPI = xhrApiScan;
      break;
    // case "webrtc":
    //   scanningAPI = webRtcScan;
    //   break;
    default:
      throw `Scanning API: ${scanningTechnique} not supported`;
  }

  return scanningAPI;
}
