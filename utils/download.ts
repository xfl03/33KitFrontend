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

function downloadUrl(url: string) {
    const a = document.createElement('a');
    a.href = url;
    a.click();
}