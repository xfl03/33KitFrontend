import * as React from 'react';
import AppBase from "../components/AppBase";
import {
    Alert,
    AlertTitle,
    FormControl,
    Grid,
    InputLabel, MenuItem, Paper,
    Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material";
import {useEffect, useState} from "react";
import EChartsReact from "echarts-for-react";
import axios from "axios";

export default function Page() {
    const [eventInfo, setEventInfo] = useState<any>();
    const [events, setEvents] = useState<Array<any>>();
    const [finalScores, setFinalScores] = useState<any>();
    const [option, setOption] = useState<any>();
    const [teamScores, setTeamScores] = useState<Array<any>>()
    useEffect(() => {
        axios.get(`/cheerful`).then(res => {
            let data = res.data;
            setEvents(data);
            setEventInfo(data[data.length - 1]);
        })
    }, [setEvents, setEventInfo])

    useEffect(() => {
        if (eventInfo === undefined) {
            return;
        }
        axios.get(`/cheerful/${eventInfo.id}`).then(res => {
            setFinalScores(res.data);
        })
    }, [eventInfo, setFinalScores])

    useEffect(() => {
        if (finalScores === undefined) {
            return;
        }
        console.log(finalScores.teams);
        let series = [];
        let teamScores0 = [];
        for (let key in finalScores.teams) {
            series.push({
                name: finalScores.teams[key],
                type: 'line',
                smooth: false,
                symbol: 'none',
                data: finalScores.memberCounts[key].map((it: any, i: number) => [finalScores.memberCounts.t[i], it]),
                yAxisIndex: 0
            });
            teamScores0.push({
                name: finalScores.teams[key],
                member: finalScores.memberCounts[key][finalScores.memberCounts[key].length - 1],
                data: finalScores.teamPoints[key],
            })
        }
        setTeamScores(teamScores0);
        console.log(teamScores0)

        setOption({
            tooltip: {
                trigger: 'axis',
            },
            toolbox: {
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    restore: {}
                }
            },
            dataZoom: [
                {
                    type: 'inside',
                    start: 0,
                    end: 100
                },
                {
                    start: 0,
                    end: 100
                }
            ],
            xAxis: {
                type: 'time',
                boundaryGap: false,
                // data: finalScores.memberCounts.t,
            },
            yAxis: {
                name: "人数",
                type: 'value',
                boundaryGap: false,
            },
            series: series
        })
    }, [finalScores])

    const handleChange = (event: SelectChangeEvent) => {
        let eventId = parseInt(event.target.value as string);
        setEventInfo(events?.find(it => it.id === eventId));
    };
    return (
        <AppBase subtitle="欢乐嘉年华活动数据">
            <Grid container spacing={2}>
                {eventInfo &&
                    <Grid item xs={12}>
                        <Alert severity="info">
                            <AlertTitle>关于欢乐嘉年华活动数据</AlertTitle>
                            项目开始时间较晚，可能部分数据有缺失。
                        </Alert>
                    </Grid>}
                <Grid item xs={12}>
                    {events && eventInfo &&
                        <FormControl>
                            <InputLabel id="event-select-label">活动</InputLabel>
                            <Select
                                labelId="event-select-label"
                                id="event-select"
                                value={eventInfo.id}
                                label="活动"
                                onChange={handleChange}
                                style={{minWidth: "300px"}}
                            >
                                {events.map(it => (
                                    <MenuItem key={it.id} value={it.id}>{it.id} - {it.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    }
                </Grid>
                {teamScores &&
                    <Grid item xs={12}>
                        <TableContainer sx={{maxWidth: 700}} component={Paper}>
                            <Table size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{textAlign: "center"}}>队伍</TableCell>
                                        <TableCell style={{textAlign: "center"}}>第1次中间发表</TableCell>
                                        <TableCell style={{textAlign: "center"}}>第2次中间发表</TableCell>
                                        <TableCell style={{textAlign: "center"}}>最终结果</TableCell>
                                        <TableCell style={{textAlign: "center"}}>最终人数</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {teamScores.map((it: any) => (<TableRow key={it.name}>
                                        <TableCell style={{textAlign: "center"}}>{it.name}</TableCell>
                                        <TableCell style={{textAlign: "center"}}>{it.data[0]}</TableCell>
                                        <TableCell style={{textAlign: "center"}}>{it.data[1]}</TableCell>
                                        <TableCell style={{textAlign: "center"}}>{it.data[2]}</TableCell>
                                        <TableCell style={{textAlign: "center"}}>{it.member}</TableCell>
                                    </TableRow>))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                }
                {option &&
                    <Grid item xs={12}>
                        <EChartsReact style={{height: '700px', maxHeight: '75%', width: '100%'}} option={option}/>
                    </Grid>
                }
            </Grid>
        </AppBase>
    )
}
