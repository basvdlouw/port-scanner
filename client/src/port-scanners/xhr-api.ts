import { Measurement } from "../models/measurement.js";
import { Port } from "../models/port.js";
import { PortScanner } from "../models/port-scanner.js";
import { PortStatus } from "../models/port-status.js";
import { ScanResult } from "../models/scan-result.js";

export const xhrApiScan: PortScanner = (
  port: Port,
  timeout: number
): Promise<ScanResult> => {
  const xhr = new XMLHttpRequest();
  let receivedData = false;
  let end = 0;
  const start = performance.now();
  const beginScan = new Date();

  return new Promise<ScanResult>((resolve) => {
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        const endTimeOfScan = new Date();
        end = performance.now() - start;
        if (xhr.status >= 200 && xhr.status < 300) {
          receivedData = true;
          port.status = PortStatus.OPEN;
          console.log(
            `PORT: ${port.number} received response with status: ${
              xhr.status
            }, status text: ${xhr.statusText}, response: ${
              xhr.responseText
            }, headers: ${JSON.stringify(xhr.getAllResponseHeaders())}`
          );
        } else {
          port.status = PortStatus.CLOSE;
          console.log(
            `PORT: ${port.number} had error: ${xhr.statusText}. Scan took: ${end} ms`
          );
        }
        clearTimeout(timeoutReference);
        resolve(
          createScanResult(
            beginScan,
            endTimeOfScan,
            port,
            end,
            false,
            receivedData
          )
        );
      }
    };

    const timeoutReference = setTimeout(() => {
      xhr.abort();
      port.status = PortStatus.TIMEOUT;
      end = performance.now() - start;
      const endTimeOfScan = new Date();
      resolve(
        createScanResult(
          beginScan,
          endTimeOfScan,
          port,
          end,
          true,
          receivedData
        )
      );
    }, timeout);

    xhr.open("GET", `http://${port.ipaddress}:${port.number}`);
    xhr.send();
  });
};

function createScanResult(
  startTimeOfScan: Date,
  endTimeOfScan: Date,
  port: Port,
  duration: number,
  timedOut: boolean,
  receivedData: boolean
): ScanResult {
  const measurement: Measurement = {
    startTimeOfScan: startTimeOfScan,
    endTimeOfScan: endTimeOfScan,
    duration,
    timedOut,
    receivedData
  };

  const result: ScanResult = { port, measurement };
  return result;
}
