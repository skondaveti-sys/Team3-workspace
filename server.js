import express from "express";
import mongoose from "mongoose";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import outagesRouter from "./routes/outages.js";
import addressesRouter from "./routes/addresses.js";
import authRouter from './routes/auth.js';
import { attachUser } from './middleware/attachUser.js';

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-secret-change-in-production';

await mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://dev:devpassword@mongo:27017/devdb?authSource=admin'
);

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://dev:devpassword@mongo:27017/devdb?authSource=admin',
  }),
}));

app.use(attachUser);

app.get("/", (req, res) => {
  res.send("Welcome to the Public Transit Helper");
});

app.get("/routes", (req, res) => {
  res.send("Transit routes listing coming soon");
});

app.get("/discussion", (req, res) => {
  res.send(
    "Discussion board coming soon — share tips and questions about local transit routes",
  );
});

app.use("/addresses", addressesRouter);
app.use("/outages", outagesRouter);
app.use(authRouter);

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
