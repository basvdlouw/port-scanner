import { TcpScanner } from "./tcpscanner";
import { type Port } from "./models/port";

const button = document.getElementById("startPortScanner");
const scannerStatus = document.getElementById("portScannerStatus");

button?.addEventListener("click", function handleClick(event) {
  const port1: Port = {
    number: 1,
    status: "open"
  };

  const port2: Port = {
    number: 2,
    status: "closed"
  };
  const tcpScanner = new TcpScanner([port1, port2]);
  scannerStatus?.append(tcpScanner.toHtmlResults());
});
