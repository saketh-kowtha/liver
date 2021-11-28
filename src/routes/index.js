const express = require("express");
const { throughDir, setRelativePath, readFile, toJSON, addSlashAtFirst, generateRouteFromFile, validateMethod, objToArray } = require("../utils");
const router = express.Router()

const files = throughDir(`./${sourceFolderName || "mocks"}`);

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