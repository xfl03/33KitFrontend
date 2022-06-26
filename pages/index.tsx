import * as React from 'react';
import AppBase from "../components/AppBase";
import {Alert, AlertTitle, Grid, Link} from "@mui/material";
import PjskDownloadButton from "../components/PjskDownloadButton";
import RecaptchaInfo from "../components/RecaptchaInfo";
import Divider from "@mui/material/Divider";
import {usePjskDownloadInfo} from "../utils/download-hook";
import {usePjskPredict} from "../utils/predict-hook";
import {useEffect, useState} from "react";
import PjskPredictTable from "../components/PjskPredictTable";

export default function Home() {
    const pjskDownloadInfo = usePjskDownloadInfo();
    const pjskPredict = usePjskPredict();
    const [ranks, setRanks] = useState<Array<number>>();
    useEffect(() => {
        setRanks([100, 500, 1000, 5000, 10000, 50000, 100000]);
    }, [setRanks]);
    return (
        <AppBase subtitle="主页">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Alert severity="info">
                        <AlertTitle>内测中！</AlertTitle>
                        33Kit还在<strong>内部测试</strong>中，出现问题请<strong>向33反馈</strong>。
                    </Alert>
                </Grid>
                {pjskPredict && ranks &&
                    <PjskPredictTable pjskPredict={pjskPredict} ranks={ranks}/>
                }
                <Grid item xs={8}>
                    <Link href="/pjsk-predict" underline="none">
                        在寻找更多预测？
                    </Link>
                </Grid>
                {pjskDownloadInfo &&
                    <PjskDownloadButton info={pjskDownloadInfo[0]}/>
                }
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