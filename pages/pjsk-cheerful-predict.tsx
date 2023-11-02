import AppBase from "../components/AppBase";
import {Alert, AlertTitle, Grid} from "@mui/material";
import * as React from "react";
import {usePjskCheerfulPredict} from "../utils/predict-hook";
import SekaiCheerfulPredictTable from "../components/sekai/cheerful-predict-table";

export default function PjskDownload() {
    const pjskCheerfulPredict = usePjskCheerfulPredict();
    return (
        <AppBase subtitle="对战预测">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Alert severity="warning">
                        <AlertTitle>关于预测接入</AlertTitle>
                        如果需要在您的应用中接入预测数据，请<strong>联系33</strong>获取<strong>无缓存、更高速</strong>的API，也可以直接通过<strong>Webhook</strong>向您推送预测结果。
                    </Alert>
                </Grid>
                {pjskCheerfulPredict &&
                    <SekaiCheerfulPredictTable pjskCheerfulPredict={pjskCheerfulPredict}/>
                }
            </Grid>
        </AppBase>
    )
}
