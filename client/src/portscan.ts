import { ConcurrentQueue } from "./concurrent-queue";
import { PortStatus } from "./models/port-status";
import { type Port } from "./models/port";
import { portRangeIsValid } from "./utils";
import { analyzePort } from "./port-scanner";

const localhost = "127.0.0.1";
const socketTimeout = 10000;
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

  if (!portRangeIsValid(beginRange, endRange)) {
    throw new Error("Invalid port range");
  }

  const queue = new ConcurrentQueue(nSockets / nScans);

  for (let i = beginRange; i <= endRange; i++) {
    const port: Port = {
      ipaddress: localhost,
      number: i,
      status: PortStatus.UNKNOWN
    };
    queue.enqueue(port, analyzePort, port, socketTimeout, nScans);
  }
});

clearResults?.addEventListener("click", function handleClick(event) {
  const rowCount = table.rows.length;
  for (let i = rowCount - 1; i > 0; i--) {
    table.deleteRow(i);
  }
});
