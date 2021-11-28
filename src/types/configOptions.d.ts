import { CorsOptions } from "cors";

interface ConfigOptions {
    port?: number,
    enableCors?: boolean,
    enableHelmet?: boolean,
    showLogs?: boolean,
    enableStaticFileServer?: boolean,
    alternativeStaticServerPathname?: string,
    allowedStaticFiles?: Array<string>,
    defaultHeaders?: Array<object>,
    namespace?: string,
    staticFilesSuportedExtensions?: Array<string>,
    sourceFolderName?: string,
    corsOptions?: CorsOptions
}

export default ConfigOptions