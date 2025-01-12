require("dotenv").config();
const cors = require("cors");
const express = require("express");
const routes = require("./routes/index");
const cookieParser = require("cookie-parser");
const setupLogger = require("./helper/logger");

const corsOptions = {
  host: "http://localhost:3000",
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionSuccessStatus: 200,
};

const app = express();

setupLogger(app);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.use((req, res, next) => {
  res.status(404).json({
    statusCode: 404,
    message: "Not Found",
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({
    statusCode: 500,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
