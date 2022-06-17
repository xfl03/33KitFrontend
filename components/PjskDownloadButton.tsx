import {PjskDownloadInfo} from "../utils/pjsk-download";
import {Alert, AlertTitle, Chip, Grid} from "@mui/material";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import Button from "@mui/material/Button";
import {CloudDownload} from "@mui/icons-material";
import * as React from "react";
import {useRef, useState} from "react";
import {downloadFile} from "../utils/download";

type DownloadProps = {
    info: PjskDownloadInfo
}
export default function PjskDownloadButton({info}: DownloadProps) {
    const [alert, setAlert] = useState<string>("");
    const [captchaVisible, setCaptchaVisible] = useState<boolean>(false);
    const captchaRef = useRef<HCaptcha>(null);

    const onClickDownload = async () => {
        setCaptchaVisible(true)
        captchaRef.current?.execute()
    };

    const onVerify = (token: string) => {
        downloadFile(info.filename, token)
            .catch(e => {
                setAlert(e.toString())
            })
    }

    // @ts-ignore
    const hcaptchaSiteKey: string = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY
    return (
        <Grid item xs={10}>
            <Grid container spacing={2}>
                <Grid item xs={10}>
                    <div>{info.name}<Chip label={info.version}/></div>
                </Grid>
                <Grid item xs={10}>
                    <Button variant="outlined" startIcon={<CloudDownload/>} onClick={onClickDownload}>下载{info.name}</Button>
                </Grid>
                <Grid item xs={10}>
                    <HCaptcha
                        sitekey={hcaptchaSiteKey}
                        ref={captchaRef}
                        onVerify={onVerify}
                        size={captchaVisible ? "normal" : "invisible"}
                    />
                </Grid>
                {
                    alert !== "" &&
                    <Grid item xs={10}>
                        <Alert severity="error">
                            <AlertTitle>出错惹！</AlertTitle>
                            {alert}
                        </Alert>
                    </Grid>
                }
            </Grid>
        </Grid>
    )
}