import { ConcurrentQueue } from "./concurrent-queue.js";
import { PortStatus } from "./models/port-status.js";
import { type Port } from "./models/port.js";
import { portRangeIsValid } from "./utils.js";
import { analyzePort } from "./port-scanner.js";
import { ResultsStore } from "./results-store.js";
import { ScanResult } from "./models/scan-result.js";
import { analyzePostScanResults } from "./post-scan-analysis.js";
import { fetchApiScan } from "./port-scanners/fetch-api.js";
import { websocketScan } from "./port-scanners/websocket-api.js";
import { PortScanner } from "./models/port-scanner.js";

const localhost = "127.0.0.1";
const startPortScanner = document.getElementById("startPortScanner");
const clearResults = document.getElementById("clearResults");
const table = document.getElementById("portScannerStatus") as HTMLTableElement;

startPortScanner?.addEventListener("click", function handleClick() {
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

  const chosenScanningTechnique = getScanningTechnique();
  let scanningTechnique: PortScanner;

  if (chosenScanningTechnique == "fetch") {
    scanningTechnique = fetchApiScan;
  }
  if (chosenScanningTechnique == "websocket") {
    scanningTechnique = websocketScan;
  }

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
    queue.enqueue(
      port,
      analyzePort,
      port,
      socketTimeout,
      nScans,
      scanningTechnique!
    );
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

clearResults?.addEventListener("click", function handleClick(): void {
  const rowCount = table.rows.length;
  for (let i = rowCount - 1; i > 0; i--) {
    table.deleteRow(i);
  }
});

function getScanningTechnique(): string {
  const chosenTechnique = document.getElementById(
    "scantechnique"
  ) as HTMLSelectElement;
  return chosenTechnique.options[chosenTechnique.selectedIndex].value;
}
