import express from "express";
import path from "path";

const app = express();
const port = 3000;

app.use(
  "/",
  express.static(path.join(__dirname, "../public/static"), {
    extensions: ["html"]
  })
);
app.use(
  "/js",
  express.static(path.join(__dirname, "../public/"), {
    extensions: ["js"]
  })
);

app.listen(port, () => {
  console.log(`Express is listening at http://localhost:${port}`);
});
