import axios from "axios";


export async function downloadFile(filename: string, token: string) {
    const e = await axios.post("/pd", {filename: filename, token: token});
    // window.open(e.data.url);
    downloadUrl(e.data.url);
}

function downloadUrl(url: string) {
    const a = document.createElement('a');
    a.href = url;
    a.click();
}