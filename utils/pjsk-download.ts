import fs from "fs";
import path from "path";

export type PjskDownloadInfo = {
    server: string,
    name: string,
    version: string,
    filename: string,
    lastUpdate: Date
}

export function loadPjskDownloadInfo(): Array<PjskDownloadInfo> {
    let fileContent = fs.readFileSync(path.join(process.cwd(), 'pjsk-download.json'), 'utf8');
    return JSON.parse(fileContent) as Array<PjskDownloadInfo>;
}