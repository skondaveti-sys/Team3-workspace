import express from "express";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Welcome to the Public Transit Helper");
});

app.get("/routes", (req, res) => {
  res.send("Transit routes listing coming soon");
});

app.get("/discussion", (req, res) => {
  res.send("Discussion board coming soon — share tips and questions about local transit routes");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
