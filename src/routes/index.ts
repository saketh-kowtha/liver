import express, { Request, Response } from "express";
import {
  throughDir,
  setRelativePath,
  readFile,
  toJSON,
  addSlashAtFirst,
  generateRouteFromFile,
  validateMethod,
  objToArray,
  getConfig,
} from "../utils";

const router: any = express.Router();
const config = getConfig(__dirname + "/..");
const { defaultHeaders, sourceFolderName } = config;

interface RouteInfo {
  response: string | object,
  headers: Array<{ [key: string]: any }>,
  route: string,
  method: string
}

function createDynamicRouteFrom(routeInfo: RouteInfo) {
  const { response, route } = routeInfo;
  const customHeaders: Array<{ [key: string]: any }> = routeInfo.headers
  const method: string = validateMethod(routeInfo.method);

  function controller(req: Request, res: Response) {
    let headers: Object[] = [];
    if (defaultHeaders && Array.isArray(defaultHeaders)) headers = [...customHeaders, ...defaultHeaders];
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
function getRouteContentAndCreate(files: Array<string>) {
  files.forEach((file) => {
    const fileWithRelativePath = setRelativePath(file);
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

export default router;
