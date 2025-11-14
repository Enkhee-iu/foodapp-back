const express = require("express");
const cors = require("cors");
const connectToDB = require("./db");

const app = express();
const PORT = 999;

app.use(cors());
app.use(express.json());

connectToDB();

app.get("/", (req, res) => {
  res.send("API is working");
});

app.listen(PORT, () => {
  console.log("API listening on http://localhost:" + PORT);
});
