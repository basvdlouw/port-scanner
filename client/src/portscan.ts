import { ConcurrentQueue } from "./concurrent-queue";
import { PortStatus } from "./models/port-status";
import { PortScan } from "./port-scanner";
import { type Port } from "./models/port";
import { portRangeIsValid } from "./utils";

const localhost = "127.0.0.1";
const maxConcurrency = 254;
const socketTimeout = 2000;
const button = document.getElementById("startPortScanner");
const queue = new ConcurrentQueue(maxConcurrency);

button?.addEventListener("click", function handleClick(event) {
  const beginRange = parseInt(
    (document.getElementById("startPort") as HTMLInputElement).value
  );
  const endRange = parseInt(
    (document.getElementById("endPort") as HTMLInputElement).value
  );

  if (!portRangeIsValid(beginRange, endRange)) {
    throw new Error("Invalid port range");
  }

  for (let i = beginRange; i <= endRange; i++) {
    const port: Port = {
      ipaddress: localhost,
      number: i,
      status: PortStatus.UNKNOWN
    };
    queue.enqueue(port, async () => {
      await PortScan.analyzePort(port, socketTimeout);
    });
  }
});
