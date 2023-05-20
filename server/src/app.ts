import express from "express";
import path from "path";
import * as http from "http";
import cors from "cors";
import { startWebSocketServer } from "./webrtc/socket";

const app = express();
const port = 3000;

app.use(
  "/",
  express.static(path.join(__dirname, "../public/"), {
    extensions: ["html"]
  })
);
app.use("/js", express.static(path.join(__dirname, "../public/")));

app.listen(port, () => {
  console.log(`Express is listening at http://localhost:${port}`);
});

app.use(cors({ origin: "*" }));

const server = http.createServer(app);

startWebSocketServer(server);

server.listen(process.env.WEBRTCPORT || 5757, () => {
  console.log("WebRTC Server started");
});
