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
const app = express();

const config = getConfig(__dirname);

const PORT = config.port || 8080;
const { defaultHeaders, sourceFolderName } = config;

app.use((req, res, next) => {
  if (config.showLogs) return logger(req, res, next);
  next();
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use((req, res, next) => {
  const initStatic = express.static(`./${sourceFolderName || "mocks"}`);
  if (config.enableStaticFileServer) return initStatic(req, res, next);
  next();
});

const files = throughDir(`./${sourceFolderName || "mocks"}`);

files.forEach((file) => {
  file = setRelativePath(file);
  const content = readFile(file);
  const parsedContent = toJSON(content);
  const route = addSlashAtFirst(
    generateRouteFromFile(file, sourceFolderName || "mocks")
  );
  parsedContent.route = route;
  createDynamicRouteFrom(parsedContent);
});

function createDynamicRouteFrom(routeInfo) {
  const { response, headers: customHeaders, route } = routeInfo;
  const method = validateMethod(routeInfo.method);

  function controller(req, res) {
    let headers = [...customHeaders];
    if (defaultHeaders && Array.isArray(defaultHeaders))
      headers = [...headers, ...defaultHeaders];
    headers.forEach((header) => {
      const [headerKey, headerValue] = objToArray(header);
      res.setHeader(headerKey, headerValue);
    });

    switch (typeof response) {
      case "object":
        return res.json(response);
      default:
        return res.send(response);
    }
  }

  app[method](route, controller);
}

app.all("*", (req, res) => {
  const htmlContent = readFile(__dirname + "/../static/notFound.html");
  res.status(404).send(htmlContent);
});

app.listen(PORT, () => {
  console.log(`Mockserver started on port number: ${PORT}`);
});
