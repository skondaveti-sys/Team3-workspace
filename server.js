import express from "express";

const app = express();
const PORT = 3000;

app.get("/discussion", (req, res) => {
  res.send("Discussion board coming soon — share tips and questions about local transit routes");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
