import { type Port } from "./models/port";
import { PortStatus } from "./models/port-status";

export async function analyzePort(port: Port, timeout: number): Promise<void> {
  await new Promise((resolve, reject) => {
    const socket = new WebSocket(`ws://${port.ipaddress}:${port.number}`);

    const timer = setTimeout(() => {
      port.status = PortStatus.TIMEOUT;
      console.log(
        `Port: ${port.number} timed out after ${timeout} milliseconds`
      );
      socket.close();
      resolve();
    }, timeout);

    socket.onopen = async () => {
      const el = document.getElementById("portScannerStatus");
      el?.append(`Port: ${port.number} was open`);
      clearTimeout(timer);
      port.status = PortStatus.OPEN;
      socket.close();
      resolve();
    };

    socket.onmessage = () => {
      const el = document.getElementById("portScannerStatus");
      el?.append(`Received data from port: ${port.number}`);
      clearTimeout(timer);
      port.status = PortStatus.MESSAGE;
      socket.close();
      resolve();
    };

    socket.onerror = () => {
      clearTimeout(timer);
      port.status = PortStatus.ERROR;
      console.log(`Port: ${port.number} received error`);
      socket.close();
      resolve();
    };

    socket.onclose = () => {
      // Only reject if the status has not been set yet
      port.status = PortStatus.CLOSE;
      socket.close();
      console.log(`Port: ${port.number} is closed`);
      resolve();
    };
  });
}
