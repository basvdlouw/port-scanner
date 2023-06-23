import express from "express";
import path from "path";
import * as http from "http";
import { startWebSocketServer } from "./webrtc/socket";
import { ScanResult } from "./models/scan-result";
import { writeFile } from "fs/promises";
import { existsSync, mkdirSync } from "fs";

const app = express();
const port = 3001;

app.use(
  "/",
  express.static(path.join(__dirname, "../public/"), {
    extensions: ["html"]
  })
);
app.use(express.json({ limit: "100mb" }));
app.use("/js", express.static(path.join(__dirname, "../public/")));

app.listen(port, () => {
  console.log(`Express is listening at http://localhost:${port}`);
});

app.post("/scanresults", async (req, res) => {
  const scanResults: ScanResult[][] = req.body;
  const resultsDirectory = path.join(__dirname, "/results");
  if (!existsSync(resultsDirectory)) {
    mkdirSync(resultsDirectory);
  }
  const filePath = path.join(resultsDirectory, `scan-results.json`);

  try {
    if (!scanResults) {
      throw new Error("Scan results are missing in the request body");
    }

    await writeFile(filePath, JSON.stringify(scanResults, null, 2));

    console.log("Scan results saved successfully");
    res.json({ message: "Scan results received and saved successfully" });
  } catch (err) {
    console.error("Error writing scan results to file:", err);
    res.status(500).json({ error: "Failed to save scan results" });
  }
});

// const server = http.createServer(app);

// startWebSocketServer(server);

// server.listen(process.env.WEBRTCPORT || 5758, () => {
//   console.log("WebSocket Server started");
// });
