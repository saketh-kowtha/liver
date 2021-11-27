const fs = require('fs')


export function isDir(path) {
    try {
        var stat = fs.lstatSync(path);
        return stat.isDirectory();
    } catch (e) {
        return false;
    }
}

export function isFile(path) {
    try {
        var stat = fs.lstatSync(path);
        return stat.isDirectory();
    } catch (e) {
        return false;
    }
}

export function readFile (path) {
    if(!isFile(path)) return
    const data = fs.readFileSync(path)
    return data.toString()
}

export const toJSON = JSON.stringify