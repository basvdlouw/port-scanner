// import { Measurement } from "../models/measurement";
// import { Port } from "../models/port";
// import { PortStatus } from "../models/port-status";
// import { ScanResult } from "../models/scan-result";

// async function fetchApiScan(port: Port, timeout: number): Promise<ScanResult> {
//     const controller = new AbortController();
//     const timeoutReference = setTimeout(() => {
//       controller.abort();
//       port.status = PortStatus.TIMEOUT;
//     }, timeout);

//     const options: RequestInit = { mode: "no-cors", signal: controller.signal };

//     let end: number;
//     let receivedData = false;
//     const timedOut = false;

//     const start = performance.now();

//     try {
//       const response = await fetch(
//         `http://${port.ipaddress}:${port.number}`,
//         options
//       );
//       end = performance.now() - start;
//       receivedData = true;
//       port.status = PortStatus.OPEN;
//       console.log(
//         `PORT: ${port.number} had response status: ${response.status} with text: ${response.text}. Scan took: ${end} ms`
//       );
//     } catch (error) {
//       end = performance.now() - start;
//       console.log(
//         `PORT: ${port.number} had error: ${error}. Scan took: ${end} ms`
//       );
//     } finally {
//       clearTimeout(timeoutReference);
//     }

//     const measurement: Measurement = {
//       duration: end,
//       timedOut,
//       receivedData
//     };

//     if (end >= timeout) {
//       measurement.timedOut = true;
//     }

//     const result: ScanResult = { port, measurement };
//     return result;
//   }
