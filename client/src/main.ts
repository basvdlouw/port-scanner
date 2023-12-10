import { ConcurrentQueue } from "./concurrent-queue.js";
import { PortStatus } from "./models/port-status.js";
import { type Port } from "./models/port.js";
import { getQueryParameter, getScanAPI, portRangeIsValid } from "./utils.js";
import { analyzePort } from "./port-scanner.js";
import { ResultsStore } from "./results-store.js";
import { ScanResult } from "./models/scan-result.js";
import { analyzePostScanResults } from "./post-scan-analysis.js";

const beginPort = parseInt(getQueryParameter("begin_port"));
const endPort = parseInt(getQueryParameter("end_port"));
const nScans = parseInt(getQueryParameter("n_scans"));
const nSockets = parseInt(getQueryParameter("n_sockets"));
const socketTimeout = parseInt(getQueryParameter("socket_timeout"));
const scanningTechnique = getQueryParameter("scanning_technique");

console.log(`Begin port: ${beginPort}`);
console.log(`End port: ${endPort}`);
console.log(`Number of scans per port: ${nScans}`);
console.log(`Number of parallel sockets: ${nSockets}`);
console.log(`Socket timeout in ms: ${socketTimeout}`);
console.log(`Scanning technique: ${scanningTechnique}`);

const localhost = "127.0.0.1";

const startPortScanner = document.getElementById("startPortScanner");
startPortScanner?.addEventListener("click", function handleClick() {
  if (!portRangeIsValid(beginPort, endPort)) {
    throw new Error("Invalid port range");
  }

  const resultsStore = new ResultsStore<ScanResult[]>();
  const queue = new ConcurrentQueue(nSockets / nScans, resultsStore);
  const startTime = performance.now();
  // add scanning jobs to queue
  for (let i = beginPort; i <= endPort; i++) {
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
      getScanAPI(scanningTechnique)
    );
  }

  queue
    .waitForCompletion()
    .then(async () => {
      const totalScanTime = performance.now() - startTime;
      try {
        // save scan results
        const results = resultsStore.getResults();
        const response = await fetch("http://localhost:3001/scanresults", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            beginPort,
            endPort,
            nScans,
            nSockets,
            socketTimeout,
            scanningTechnique,
            totalScanTime,
            results
          })
        });

        const data = await response.json();
        console.log(data.message);

        document.getElementById("finished")?.classList.remove("hidden");
      } catch (error) {
        console.error("Error:", error);
      }
      // analyzePostScanResults(resultsStore, socketTimeout);
    })
    .catch((error) => {
      console.error(error);
    });
});
