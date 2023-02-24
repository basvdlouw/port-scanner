import { type Port } from "./models/port";

export class TcpScanner {
  private readonly ports: Port[];

  constructor(ports: Port[]) {
    this.ports = ports;
  }

  toHtmlResults(): string {
    return `<h1> Ports to be scanned: ${this.ports[0].number} </h1>`;
  }
}
