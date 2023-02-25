import { type Port } from "./models/port";
import { PortStatus } from "./models/port-status";

export async function analyzePort(port: Port, timeout: number): Promise<Port> {
  return await new Promise<Port>((resolve) => {
    const socket = new WebSocket(`ws://${port.ipaddress}:${port.number}`);

    const timer = setTimeout(() => {
      port.status = PortStatus.TIMEOUT;
      console.log(
        `Port: ${port.number} timed out after ${timeout} milliseconds`
      );
      socket.close();
      resolve(port);
    }, timeout);

    socket.onopen = async () => {
      const el = document.getElementById("portScannerStatus");
      el?.append(`Port: ${port.number} was open`);
      clearTimeout(timer);
      port.status = PortStatus.OPEN;
      socket.close();
      resolve(port);
    };

    socket.onmessage = () => {
      const el = document.getElementById("portScannerStatus");
      el?.append(`Received data from port: ${port.number}`);
      clearTimeout(timer);
      port.status = PortStatus.MESSAGE;
      socket.close();
      resolve(port);
    };

    socket.onerror = () => {
      clearTimeout(timer);
      port.status = PortStatus.ERROR;
      console.log(`Port: ${port.number} received error`);
      socket.close();
      resolve(port);
    };

    socket.onclose = () => {
      // Only reject if the status has not been set yet
      if (
        port.status !== PortStatus.TIMEOUT &&
        port.status !== PortStatus.OPEN &&
        port.status !== PortStatus.MESSAGE &&
        port.status !== PortStatus.ERROR
      ) {
        port.status = PortStatus.CLOSE;
      }
      socket.close();
      console.log(`Port: ${port.number} is closed`);
      resolve(port);
    };
  });
}
