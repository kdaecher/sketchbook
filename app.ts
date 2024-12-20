import express from "express";
import path from "path";

const app = express();
const PORT = 8080;

app.use(express.static(path.join(__dirname, '/')));

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
