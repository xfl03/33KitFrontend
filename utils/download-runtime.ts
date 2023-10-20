import axios from "axios";

export async function downloadFileRecaptchaV3(filename: string, token: string) {
    const e = await axios.post("/pd", {filename: filename, recaptchaToken: token});
    console.log(e.data);
    downloadUrl(e.data.url);
}

export async function downloadFileHcaptcha(filename: string, token: string) {
    const e = await axios.post("/pd", {filename: filename, token: token});
    console.log(e.data);
    downloadUrl(e.data.url);
}

export function downloadUrl(url: string) {
    const a = document.createElement('a');
    a.href = url;
    a.click();
}

export type PjskDownloadInfo = {
    server: string,
    name: string,
    version: string,
    filename: string,
    lastUpdate: Date
}

export async function getPjskDownloadInfo(): Promise<Array<PjskDownloadInfo>> {
    let res = await axios.get(`${process.env.NEXT_PUBLIC_SEKAIDL_BASE}pjsk-download.json`);
    console.log(res.data);
    return res.data;
}
