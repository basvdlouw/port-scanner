import * as WebSocket from "ws";
import { Server as HttpServer } from "http";

export function startWebSocketServer(server: HttpServer) {
  const webSocketServer = new WebSocket.Server({ server });
  configureWebSocketServer(webSocketServer);
}

function configureWebSocketServer(webSocketServer: WebSocket.Server) {
  webSocketServer.on("connection", (webSocket: WebSocket) => {
    webSocket.on("message", (message: string) => {
      console.log("Message from client :: " + message);
      webSocket.send("Echo :: " + message);
    });

    webSocket.send("Welcome to chat !!");
  });
}
