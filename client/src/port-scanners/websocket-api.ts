import { Measurement } from "../models/measurement";
import { Port } from "../models/port";
import { PortStatus } from "../models/port-status";
import { ScanResult } from "../models/scan-result";

function connectToWebsocket(port: Port, socket: WebSocket): Promise<Port> {
  return new Promise(function (resolve) {
    socket.onopen = function () {
      console.log(`WebSocket connection opened on port ${port.number}`);
      port.status = PortStatus.OPEN;
      resolve(port);
    };
    socket.onerror = function (err) {
      console.log(
        `WebSocket connection received error: ${err} on port ${port.number} with code`
      );
      port.status = PortStatus.ERROR;
      resolve(port);
    };
    socket.onclose = (event) => {
      port.status = PortStatus.CLOSE;
      console.log(
        `WebSocket connection closed on port ${port.number} with code`,
        event.code
      );
      resolve(port);
    };
  });
}
// async function websocketScan(port: Port, timeout: number): Promise<ScanResult> {
//   const start = performance.now();
//   const socket = new WebSocket(`ws://${port.ipaddress}:${port.number}`);

//   let timeoutReference = setTimeout(() => {
//     if (socket.readyState !== WebSocket.OPEN) {
//       console.error(`WebSocket connection to port ${port.number} timed out`);
//       port.status = PortStatus.TIMEOUT;
//       socket.close();
//     }
//   }, timeout);

//   const connectPromise = connectToWebsocket(port, socket);

//   const scannedPort = await Promise.race([
//     connectPromise,
//     new Promise((resolve) => {
//       setTimeout(() => {
//         console.error(`WebSocket connection to port ${port.number} timed out`);
//         port.status = PortStatus.TIMEOUT;
//         if (socket.readyState !== WebSocket.OPEN) {
//           socket.close();
//         }
//         resolve(port);
//       }, timeout);
//     }),
//   ]) as Port;;

//   clearTimeout(timeoutReference);
//   socket.close();
//   const end = performance.now() - start;

//   const measurement: Measurement = {
//     duration: end,
//     timedOut: scannedPort.status === PortStatus.TIMEOUT,
//     receivedData: scannedPort.status === PortStatus.OPEN
//   };

//   if (end >= timeout) {
//     measurement.timedOut = true;
//   }

//   const result: ScanResult = { port, measurement };
//   return result;
// }
