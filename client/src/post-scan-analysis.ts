import { PortStatus } from "./models/port-status.js";
import { ScanResult } from "./models/scan-result.js";
import { ResultsStore } from "./results-store.js";
import { displayResults, sortTableByPortNumber } from "./utils.js";

export function analyzePostScanResults(
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
