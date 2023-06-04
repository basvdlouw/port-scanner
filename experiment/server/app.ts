import express from "express";
import * as http from "http";

const app = express();
const beginPort = process.env.BEGIN_PORT || "3000";
const endPort = process.env.END_PORT || "3005";

function startServer(port: any) {
  const server = http.createServer(app);
  server.listen(port, () => {
    console.log(`Express is listening at http://localhost:${port}`);
  });
}

for (let port = parseInt(beginPort); port <= parseInt(endPort); port++) {
  startServer(port.toString());
}
