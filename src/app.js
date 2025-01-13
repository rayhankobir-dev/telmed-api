require("dotenv").config();
const cors = require("cors");
const express = require("express");
const routes = require("./routes/index");
const cookieParser = require("cookie-parser");

const corsOptions = {
  host: "http://localhost:3000",
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionSuccessStatus: 200,
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

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
