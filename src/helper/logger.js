const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const { getFormattedDate } = require("./utils/lib");

const logDirectory = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, getFormattedDate() + ".log"),
  { flags: "a" }
);

const setupLogger = (app) => {
  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  } else {
    app.use(morgan("combined", { stream: accessLogStream }));
  }
};

module.exports = setupLogger;
