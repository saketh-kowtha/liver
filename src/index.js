#! /usr/bin/env node
const {
  throughDir,
  readFile,
  generateRouteFromFile,
  toJSON,
  objToArray,
  setRelativePath,
  addSlashAtFirst,
  validateMethod,
  getConfig,
} = require("./utils");
const express = require("express");
const logger = require("./middlewares/logger");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

const config = getConfig(__dirname);

const PORT = config.port || 8080;

const {
  defaultHeaders,
  sourceFolderName,
  enableCors,
  corsOptions,
  enableHelmet
} = config;

app.use((req, res, next) => {
  if (config.showLogs) return logger(req, res, next);
  next();
});

app.use((req, res, next) => {
  if (enableCors) {
    return cors(corsOptions || {})(req, res, next);
  }
  next();
});

app.use((req, res, next) => {
  if (enableHelmet) {
    return helmet()(req, res, next);
  }
  next();
});

app.use((req, res, next) => {
  const initStatic = express.static(`./${sourceFolderName || "mocks"}`);
  if (config.enableStaticFileServer) return initStatic(req, res, next);
  next();
});






app.all("*", (req, res) => {
  const htmlContent = readFile(__dirname + "/../static/notFound.html");
  res.status(404).send(htmlContent);
});

app.listen(PORT, () => {
  console.log(`Mockserver started on port number: ${PORT}`);
});
