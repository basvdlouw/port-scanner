import { ConcurrentQueue } from "./concurrent-queue.js";
import { PortStatus } from "./models/port-status.js";
import { type Port } from "./models/port.js";
import {
  displayResults,
  portRangeIsValid,
  sortTableByPortNumber
} from "./utils.js";
import { analyzePort } from "./port-scanner.js";
import { ResultsStore } from "./results-store.js";
import { ScanResult } from "./models/scan-result.js";

const localhost = "127.0.0.1";
const startPortScanner = document.getElementById("startPortScanner");
const clearResults = document.getElementById("clearResults");
const table = document.getElementById("portScannerStatus") as HTMLTableElement;

startPortScanner?.addEventListener("click", function handleClick(event) {
  const beginRange = parseInt(
    (document.getElementById("startPort") as HTMLInputElement).value
  );
  const endRange = parseInt(
    (document.getElementById("endPort") as HTMLInputElement).value
  );
  const nScans = parseInt(
    (document.getElementById("nScans") as HTMLInputElement).value
  );
  const nSockets = parseInt(
    (document.getElementById("nSockets") as HTMLInputElement).value
  );
  const socketTimeout = parseInt(
    (document.getElementById("socketTimeout") as HTMLInputElement).value
  );

  if (!portRangeIsValid(beginRange, endRange)) {
    throw new Error("Invalid port range");
  }

  const resultsStore = new ResultsStore<ScanResult[]>();
  const queue = new ConcurrentQueue(nSockets / nScans, resultsStore);

  // scan
  for (let i = beginRange; i <= endRange; i++) {
    const port: Port = {
      ipaddress: localhost,
      number: i,
      status: PortStatus.UNKNOWN
    };
    queue.enqueue(port, analyzePort, port, socketTimeout, nScans);
  }

  queue
    .waitForCompletion()
    .then(() => {
      // post scan analysis
      analyzePostScanResults(resultsStore, socketTimeout);
    })
    .catch((error) => {
      console.error(error);
    });
});

clearResults?.addEventListener("click", function handleClick(event): void {
  const rowCount = table.rows.length;
  for (let i = rowCount - 1; i > 0; i--) {
    table.deleteRow(i);
  }
});

function analyzePostScanResults(
  resultsStore: ResultsStore<ScanResult[]>,
  timeout: number
): void {
  console.log("Starting post scan analysis");

  let totalDuration = 0;
  let numScans = 0;

  for (const results of resultsStore.getResults()) {
    for (const result of results) {
      if (result.port.status !== PortStatus.OPEN && result.port.number > 1024) {
        totalDuration += result.measurement.duration;
        numScans++;
      }
    }
  }

  const averageScanDuration = numScans > 0 ? totalDuration / numScans : 0;

  console.log(
    `Average duration for ${numScans} scans was: ${averageScanDuration}, this statistic excludes confirmed open ports and ports 1-1024`
  );

  const deviantScanResults = getScanResultsBelowThresholdDuration(
    resultsStore,
    timeout,
    1.0
  );

  for (const result of deviantScanResults) {
    displayResults(result.port, [result.measurement], 1);
  }

  sortTableByPortNumber();
  console.log("Added ports that are likely open");
  console.log("Post scan analysis finished");
}

// testing if this is viable (does not take into account throtteling/killed connections... however... fairly reliable results so far... )
function getScanResultsBelowThresholdDuration(
  resultsStore: ResultsStore<ScanResult[]>,
  timeout: number,
  threshold: number
): ScanResult[] {
  const likelyOpenPorts: ScanResult[] = [];
  const uniquePorts = new Set<number>();

  resultsStore.getResults().forEach((results) => {
    results.forEach((result) => {
      if (
        result.measurement.duration < timeout * threshold &&
        !uniquePorts.has(result.port.number) &&
        result.port.status !== PortStatus.OPEN &&
        result.port.number > 1024 // Should remove restricted/unsafe ports instead of first 1024. Not all well known ports are restricted and some ports after 1024 are restricted.
      ) {
        result.port.status = PortStatus.LIKELY_OPEN;
        likelyOpenPorts.push(result);
        uniquePorts.add(result.port.number);
      }
    });
  });

  return likelyOpenPorts;
}
