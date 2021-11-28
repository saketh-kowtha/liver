const express = require("express");
const {
  throughDir,
  setRelativePath,
  readFile,
  toJSON,
  addSlashAtFirst,
  generateRouteFromFile,
  validateMethod,
  objToArray,
  getConfig,
} = require("../utils");

const router = express.Router();
const config = getConfig(__dirname + "/..");
const { defaultHeaders, sourceFolderName } = config;

function createDynamicRouteFrom(routeInfo) {
  const { response, headers: customHeaders = [], route } = routeInfo;
  const method = validateMethod(routeInfo.method);

  function controller(req, res) {
    let headers = [...customHeaders];
    if (defaultHeaders && Array.isArray(defaultHeaders)) headers = [...headers, ...defaultHeaders];
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

  router[method](route, controller);
}
function getRouteContentAndCreate(files) {
  files.forEach((file) => {
    fileWithRelativePath = setRelativePath(file);
    const content = readFile(fileWithRelativePath);
    const parsedContent = toJSON(content);

    if (Array.isArray(parsedContent)) {
      return parsedContent.forEach(createDynamicRouteFrom);
    }

    const route = addSlashAtFirst(generateRouteFromFile(fileWithRelativePath, sourceFolderName || "mocks"));
    if (!parsedContent.route) parsedContent.route = route;
    createDynamicRouteFrom(parsedContent);
  });
}

const files = throughDir(`./${sourceFolderName || "mocks"}`);

getRouteContentAndCreate(files);

module.exports = router;
