import { NextFunction, Response, Request } from "express";
import colors from 'colors'

function addColorToLoggerBy(statusCode: number): Function {
  return (message: string) => {
    if (statusCode < 400) return console.log(colors.green(message))
    else if (statusCode < 500) return console.log(colors.red(message))
    return console.log(colors.bgRed(message))
  }
}

function logger(req: Request, res: Response, next: NextFunction) {
  const end = res.end;
  res.end = function (chunk) {
    const loggerWithColor = addColorToLoggerBy(res.statusCode)
    loggerWithColor(`${req.url} ${req.method} ${res.statusCode}`);
    res.end = end
    res.end(chunk)
  };
  next();
}

export default logger