import AppBase from "../components/AppBase";
import {
    Alert,
    AlertTitle,
    Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from "@mui/material";
import * as React from "react";
import {usePjskCheerfulPredict} from "../utils/predict-hook";

function formatPercent(num: number) {
    return `${(num * 100).toFixed(1)}%`;
}

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
                    <Grid item xs={12}>
                        <Alert severity="info">
                            <AlertTitle>关于预测</AlertTitle>
                            预测生成时间为<strong>{(new Date(pjskCheerfulPredict.timestamp)).toLocaleString()}</strong>，预测的活动为「<strong>{pjskCheerfulPredict.eventName}</strong>」。
                        </Alert>
                    </Grid>
                }
                {pjskCheerfulPredict &&
                    <Grid item xs={12}>
                        <TableContainer sx={{maxWidth: 500}} component={Paper}>
                            <Table aria-label="spanning table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>队伍</TableCell>
                                        {pjskCheerfulPredict.teams.map((it: any) =>
                                            <TableCell key={it}>{pjskCheerfulPredict.names[it]}</TableCell>
                                        )}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {pjskCheerfulPredict.announces.map((announce: any, index: number) =>
                                        [
                                            <TableRow key={index + 10}>
                                                <TableCell style={{textAlign: "center"}} colSpan={3}>
                                                    <strong>第{index + 1}次中间发表</strong>
                                                </TableCell>
                                            </TableRow>,
                                            <TableRow key={index + 20}>
                                                <TableCell>分数</TableCell>
                                                {pjskCheerfulPredict.teams.map((it: any) =>
                                                    <TableCell key={it}>{announce.points[it]}</TableCell>
                                                )}
                                            </TableRow>,
                                            <TableRow key={index + 30}>
                                                <TableCell>估计胜率</TableCell>
                                                {pjskCheerfulPredict.teams.map((it: any) =>
                                                    <TableCell key={it}>{formatPercent(announce.rates[it])}</TableCell>
                                                )}
                                            </TableRow>
                                        ]
                                    )}
                                    <TableRow>
                                        <TableCell style={{textAlign: "center"}} colSpan={3}>
                                            <strong>预测</strong>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>人数</TableCell>
                                        {pjskCheerfulPredict.teams.map((it: any) =>
                                            <TableCell key={it}>{pjskCheerfulPredict.members[it]}</TableCell>
                                        )}
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>预测胜率</TableCell>
                                        {pjskCheerfulPredict.teams.map((it: any) =>
                                            <TableCell key={it}>
                                                {formatPercent(pjskCheerfulPredict.predictRates[it])}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                }
            </Grid>
        </AppBase>
    )
}