import axios from "axios";


export async function downloadFile(filename: string, token: string) {
    const e = await axios.post("/pd", {filename: filename, token: token});
    window.open(e.data.url);
}