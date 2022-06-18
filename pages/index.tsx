import * as React from 'react';
import AppBase from "../components/AppBase";
import {loadPjskDownloadInfo, PjskDownloadInfo} from "../utils/pjsk-download";
import {Alert, AlertTitle, Grid, Link} from "@mui/material";
import PjskDownloadButton from "../components/PjskDownloadButton";
import RecaptchaInfo from "../components/RecaptchaInfo";
import Divider from "@mui/material/Divider";

export default function Home(
    {
        pjskDownloadInfo
    }: {
        pjskDownloadInfo: Array<PjskDownloadInfo>
    }
) {
    return (
        <AppBase subtitle="主页">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Alert severity="info">
                        <AlertTitle>内测中！</AlertTitle>
                        33Kit还在<strong>内部测试</strong>中，出现问题请<strong>向33反馈</strong>。
                    </Alert>
                </Grid>
                <PjskDownloadButton info={pjskDownloadInfo[0]}/>
                <Grid item xs={8}>
                    <Link href="/pjsk-download" underline="none">
                        在寻找其他服务器？
                    </Link>
                </Grid>
                <Grid item xs={12}>
                    <Divider/>
                </Grid>
                <RecaptchaInfo/>
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

