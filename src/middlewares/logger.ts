import { NextFunction, Response, Request } from "express";

function logger(req: Request, res: Response, next:NextFunction) {
    const end = res.end;
    res.end = function (chunk) {
      console.log(`${req.url} ${req.method} ${res.statusCode}`);
      res.end = end
      res.end(chunk)
    };
    next();
  }

export default logger