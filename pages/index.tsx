import * as React from 'react';
import AppBase from "../components/AppBase";
import {Alert, AlertTitle, Grid, Link} from "@mui/material";
import RecaptchaInfo from "../components/RecaptchaInfo";
import Divider from "@mui/material/Divider";
import {usePjskCheerfulPredict, usePjskPredict} from "../utils/predict-hook";
import {useEffect, useState} from "react";
import PjskPredictTable from "../components/PjskPredictTable";
import SekaiCheerfulPredictTable from "../components/sekai/cheerful-predict-table";

export default function Home(
//     {pjskPredict, pjskDownloadInfo}: {
//     pjskPredict: any,
//     pjskDownloadInfo: PjskDownloadInfo[]
// }
) {
    // const pjskDownloadInfo = usePjskDownloadInfo();
    const pjskPredict = usePjskPredict();
    const pjskCheerfulPredict = usePjskCheerfulPredict();
    const [ranks, setRanks] = useState<Array<number>>();
    useEffect(() => {
        setRanks([50, 100, 500, 1000, 5000, 10000, 50000, 100000]);
    }, [setRanks]);
    return (
        <AppBase subtitle="主页">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Alert severity="info">
                        <AlertTitle>测试中！</AlertTitle>
                        33 Kit还在<strong>测试</strong>中，出现问题请<strong>向33反馈</strong>。
                        <br/>
                        为了提供更好的访问速度与服务质量，33 Kit需要您的支持，<Link
                        href="https://afdian.com/@xfl03">捐助请点这里</Link>。
                        <br/>
                        因时间、精力、能力有限，33 Kit主要服务使用<strong>简体中文</strong>的用户，「Project SEKAI」相关内容以<strong>日服</strong>为主。
                    </Alert>
                </Grid>
                {pjskPredict && ranks &&
                    <PjskPredictTable pjskPredict={pjskPredict} ranks={ranks}/>
                }
                {pjskCheerfulPredict && <SekaiCheerfulPredictTable pjskCheerfulPredict={pjskCheerfulPredict}/>}
                <Grid item xs={12}>
                    <Divider/>
                </Grid>
                <Grid item xs={12}>
                    友情链接：
                    <Link href="https://sekai.best" style={{marginLeft: '10px'}}>Sekai Viewer</Link>
                    <Link href="https://pjsk.moe/" style={{marginLeft: '10px'}}>Moesekai</Link>
                </Grid>
                <RecaptchaInfo/>
            </Grid>
        </AppBase>
    )
}