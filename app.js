require("dotenv").config();
require("express-async-errors");

const helemt = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const rateLimiter = require("express-rate-limit");
const path = require("path");

const express = require("express");
const app = express();

const connectDB = require("./db/connect");
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authUser = require("./middleware/authentication");

app.use(express.json());

// extra packages
app.set("trust-proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  })
);
app.use(helemt());
app.use(cors());
app.use(xss());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Serve the index.html on the root path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authUser, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
