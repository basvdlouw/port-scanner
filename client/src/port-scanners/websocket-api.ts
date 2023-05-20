import { Measurement } from "../models/measurement.js";
import { Port } from "../models/port.js";
import { PortScanner } from "../models/port-scanner.js";
import { PortStatus } from "../models/port-status.js";
import { ScanResult } from "../models/scan-result.js";
import e from "cors";

export const websocketScan: PortScanner = async (
  port: Port,
  timeout: number
): Promise<ScanResult> => {
  const start = performance.now();
  const socket = new WebSocket(`ws://${port.ipaddress}:${port.number}`);

  const timeoutReference = setTimeout(() => {
    if (socket.readyState !== WebSocket.OPEN) {
      console.error(`WebSocket connection to port ${port.number} timed out`);
      port.status = PortStatus.TIMEOUT;
      socket.close();
    }
  }, timeout);

  const scannedPort = await connectToWebsocket(port, socket);

  clearTimeout(timeoutReference);
  socket.close();
  const end = performance.now() - start;

  const measurement: Measurement = {
    duration: end,
    timedOut: scannedPort.status === PortStatus.TIMEOUT,
    receivedData: scannedPort.status === PortStatus.OPEN
  };

  if (end >= timeout) {
    measurement.timedOut = true;
  }

  const result: ScanResult = { port, measurement };
  return result;
};

function connectToWebsocket(port: Port, socket: WebSocket): Promise<Port> {
  return new Promise(function (resolve) {
    socket.onopen = function () {
      console.log(`WebSocket connection opened on port ${port.number}`);
      port.status = PortStatus.OPEN;
      resolve(port);
    };
    socket.onerror = function (err: Event) {
      console.log(`WebSocket connection received error on port ${port.number}`);
      port.status = PortStatus.ERROR;
      resolve(port);
    };
    socket.onclose = (event: CloseEvent) => {
      port.status = PortStatus.CLOSE;
      console.log(
        `WebSocket connection closed on port ${port.number} with data: event code: ${event.code}, event reason: ${event.reason}}}`
      );
      resolve(port);
    };
  });
}
