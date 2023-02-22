import AppBase from "../components/AppBase";
import {
    Alert,
    AlertTitle,
    Grid,
} from "@mui/material";
import * as React from "react";
import {usePjskPredict} from "../utils/predict-hook";
import {useEffect, useState} from "react";
import PjskPredictTable from "../components/PjskPredictTable";

export default function PjskDownload() {
    const pjskPredict = usePjskPredict();
    const [ranks, setRanks] = useState<Array<number>>();
    useEffect(() => {
        setRanks([50, 100, 200, 300, 400, 500, 1000, 2000, 3000, 4000, 5000, 10000, 20000, 30000, 40000, 50000, 100000]);
    }, [setRanks]);
    return (
        <AppBase subtitle="活动预测">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Alert severity="warning">
                        <AlertTitle>关于预测接入</AlertTitle>
                        如果需要在您的应用中接入预测数据，请<strong>联系33</strong>获取<strong>无缓存、更高速</strong>的API，也可以直接通过<strong>Webhook</strong>向您推送预测结果。
                    </Alert>
                </Grid>
                {pjskPredict && ranks &&
                    <PjskPredictTable pjskPredict={pjskPredict} ranks={ranks}/>
                }
            </Grid>
        </AppBase>
    )
}