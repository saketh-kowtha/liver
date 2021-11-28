#! /usr/bin/env node
const { getConfig, getExtensionFrom } = require("./utils");
const express = require("express");
const logger = require("./middlewares/logger");
const cors = require("cors");
const helmet = require("helmet");
const router = require("./routes");
const path = require("path");
const app = express();

const config = getConfig(__dirname);

const PORT = config.port || 8080;

const {
  sourceFolderName,
  enableCors,
  corsOptions,
  enableHelmet,
  namespace = "",
  staticFilesSuportedExtensions,
  alternativeStaticServerPathname,
  showLogs,
} = config;

if (showLogs) app.use(logger);
if (enableCors) app.use(cors(corsOptions || {}));
if (enableHelmet) app.use(helmet());
if (alternativeStaticServerPathname) app.use(express.static(alternativeStaticServerPathname));
if (namespace) app.use(`/${namespace}`, router);
else app.use(`/`, router);

app.use((req, res, next) => {
  const extension = getExtensionFrom(req.url);
  const { enableStaticFileServer } = config;
  const doesCurrentUrlHasSupportedExtensions = staticFilesSuportedExtensions.includes(extension);
  if (enableStaticFileServer && doesCurrentUrlHasSupportedExtensions)
    return express.static(`./${sourceFolderName || "mocks"}`).apply(null, req, res, next);
  next();
});

app.all("*", (req, res) => res.sendFile(path.resolve(__dirname + "/../static/notFound.html")));

app.listen(PORT, () => {
  console.log(`Mockserver started on port number: ${PORT}`);
});
