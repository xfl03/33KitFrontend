import {Alert, AlertTitle, Chip, Grid} from "@mui/material";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import Button from "@mui/material/Button";
import {CloudDone, CloudDownload, Downloading} from "@mui/icons-material";
import * as React from "react";
import {useCallback, useRef, useState} from "react";
import {downloadFileHcaptcha, downloadFileRecaptchaV3, PjskDownloadInfo} from "../utils/download-runtime";
import {GoogleReCaptcha} from "react-google-recaptcha-v3";

type DownloadProps = {
    info: PjskDownloadInfo
}
export default function PjskDownloadButton({info}: DownloadProps) {
    // console.log("PjskDownloadButton");
    const [alert, setAlert] = useState<string>("");
    const [captchaVisible, setCaptchaVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<number>(0);
    const captchaRef = useRef<HCaptcha>(null);
    const [token, setToken] = useState<string>();

    const onRecaptchaFailed = useCallback(async () => {
        setCaptchaVisible(true)
        captchaRef.current?.execute()
    }, [setCaptchaVisible]);

    const downloadByRecaptcha = useCallback(async (token0: string) => {
        downloadFileRecaptchaV3(info.filename, token0)
            .then(() => {
                setLoading(0);
            })
            .catch(e => {
                console.warn(e);
                onRecaptchaFailed();
            })
    }, [info.filename, onRecaptchaFailed])

    const onDownloadButtonClicked = useCallback(async () => {
        setLoading(1);
        console.log(token);
        if (token === undefined) {
            // await onRecaptchaFailed();
            return;
        }
        await downloadByRecaptcha(token)
    }, [downloadByRecaptcha, token, setLoading]);

    const onRecaptchaVerify = useCallback(async (token0: string) => {
        setToken(token0);
        // console.log(loading + " " + token0)
        if (loading === 1) {
            await downloadByRecaptcha(token0)
        }
    }, [downloadByRecaptcha, setToken, loading]);

    const onHcaptchaVerify = useCallback((token: string) => {
        downloadFileHcaptcha(info.filename, token)
            .catch(e => {
                setAlert(e.toString())
            }).finally(() => {
            setLoading(0);
            setCaptchaVisible(false);
        })
    }, [info.filename]);

    // @ts-ignore
    const hcaptchaSiteKey: string = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY
    return (
        <Grid item xs={10}>
            <Grid container spacing={2}>
                <Grid item xs={10}>
                    <div>{info.name}<Chip icon={<CloudDone/>} label={info.version}/></div>
                </Grid>
                <Grid item xs={10}>
                    {loading === 0 &&
                        <Button variant="contained" startIcon={<CloudDownload/>}
                            // disabled={token === undefined}
                                onClick={onDownloadButtonClicked}>下载{info.name}</Button>
                    }
                    {loading === 1 &&
                        <Button variant="contained" startIcon={<Downloading/>}
                                disabled={true}>正在获取下载地址</Button>
                    }
                </Grid>
                <Grid item xs={10}>
                    <GoogleReCaptcha
                        action={info.server}
                        onVerify={onRecaptchaVerify}
                    />
                    {captchaVisible &&
                        <HCaptcha
                            sitekey={hcaptchaSiteKey}
                            ref={captchaRef}
                            onVerify={onHcaptchaVerify}
                            size="normal"
                        />
                    }
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