import { type Port } from "./models/port";
import { PortStatus } from "./models/port-status";

export async function analyzePort(port: Port, timeout: number): Promise<void> {
  await new Promise((resolve, reject) => {
    const socket = new WebSocket(`ws://${port.ipaddress}:${port.number}`);

    const timer = setTimeout(() => {
      port.status = PortStatus.TIMEOUT;
      console.log(
        `Websocket did not give a repsonse after ${timeout} milliseconds:`,
        port.number
      );
      socket.close();
      resolve(port);
    }, timeout);

    socket.onopen = async () => {
      const el = document.getElementById("portScannerStatus");
      el?.append(`PORT WAS OPEN: ${port.number}`);
      clearTimeout(timer);
      port.status = PortStatus.OPEN;
      console.log("Connected to port:", port.number);
      socket.close();
      resolve(port);
    };

    socket.onmessage = () => {
      const el = document.getElementById("portScannerStatus");
      el?.append(`GOT MESSAGE FROM PORT: ${port.number}`);
      clearTimeout(timer);
      port.status = PortStatus.MESSAGE;
      console.log("Received data from port:", port.number);
      socket.close();
      resolve(port);
    };

    socket.onerror = () => {
      clearTimeout(timer);
      port.status = PortStatus.ERROR;
      // console.log("Error occurred for port:", port.number);
      socket.close();
      resolve(port);
    };

    socket.onclose = () => {
      // Only reject if the status has not been set yet
      port.status = PortStatus.CLOSE;
      socket.close();
      // console.log("Closed event occurred for port:", port.number);
      resolve(port);
    };
  });
}
