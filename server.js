import express from "express";
import outagesRouter from "./routes/outages.js";
import addressesRouter from "./routes/addresses.js";

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to the Public TransitHelper");
});

app.get("/routes", (req, res) => {
  res.send("Transit routes listing comingsoon");
});

app.get("/discussion", (req, res) => {
  res.send(
    "Discussion board coming soon — share tips and questions about local transit routes",
  );
});

app.use("/addresses", addressesRouter);
app.use("/outages", outagesRouter);

// Four parameters: the error handler. Malformed JSON gets a 4xx; anything else a 500.
app.use((err, req, res, next) => {
  if (err.status >= 400 && err.status < 500) {
    res
      .status(err.status)
      .json({
        error:
          "The request could not be read. Check what you sent and try again.",
      });
    return;
  }
  console.error(err);
  res
    .status(500)
    .json({ error: "Something went wrong on our side. Please try again." });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
