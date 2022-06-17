import Button from '@mui/material/Button'
import * as React from 'react';
import AppBase from "../components/AppBase";
import {loadPjskDownloadInfo, PjskDownloadInfo} from "../utils/pjsk-download";
import {Download} from "@mui/icons-material";
import {Alert, AlertTitle, Grid, Link} from "@mui/material";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import {useRef, useState} from "react";
import {downloadFile} from "../utils/download";

export default function Home(
    {
        pjskDownloadInfo
    }: {
        pjskDownloadInfo: Array<PjskDownloadInfo>
    }
) {
    const [alert, setAlert] = useState<string>("");
    const [captchaVisible, setCaptchaVisible] = useState<boolean>(false);
    const captchaRef = useRef<HCaptcha>(null);

    const onClickDownload = async () => {
        setCaptchaVisible(true)
        captchaRef.current?.execute()
    };

    const onVerify = (token: string) => {
        downloadFile(pjskDownloadInfo[0].filename, token)
            .catch(e => {
                setAlert(e.toString())
            })
    }

    // @ts-ignore
    const hcaptchaSiteKey: string = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY

    return (
        <AppBase title="主页">
            <Grid container spacing={2}>
                {
                    alert !== "" &&
                    <Grid item xs={10}>
                        <Alert severity="error">
                            <AlertTitle>出错惹！</AlertTitle>
                            {alert}
                        </Alert>
                    </Grid>
                }
                <Grid item xs={10}>
                    <HCaptcha
                        sitekey={hcaptchaSiteKey}
                        ref={captchaRef}
                        onVerify={onVerify}
                        size={captchaVisible ? "normal" : "invisible"}
                    />
                </Grid>

                <Grid item xs={10}>
                    <Button variant="outlined" startIcon={<Download/>} onClick={onClickDownload}>下载日服客户端</Button>
                </Grid>
                <Grid item xs={8}>
                    <Link href="/pjsk-download" underline="none">
                        其他服务器……
                    </Link>
                </Grid>
            </Grid>
        </AppBase>
    )
}

export async function getStaticProps() {
    const pjskDownloadInfo = loadPjskDownloadInfo()

    return {
        props: {
            pjskDownloadInfo
        }
    }
}

