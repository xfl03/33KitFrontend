'use client'
import * as React from 'react';
import AppBase from "../components/AppBase";
import {
    Alert,
    AlertTitle,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel, MenuItem,
    Select, SelectChangeEvent
} from "@mui/material";
import {useEffect, useState} from "react";
import EChartsReact from "echarts-for-react";
import axios from "axios";

export default function Page() {
    const [eventInfo, setEventInfo] = useState<any>();
    const [eventHot, setEventHot] = useState<number>();
    const [events, setEvents] = useState<Array<any>>();
    const [finalScores, setFinalScores] = useState<Array<any>>();
    const [option, setOption] = useState<any>();
    const [checked, setChecked] = React.useState([true, true]);
    useEffect(() => {
        axios.get(`/final`).then(res => {
            let data = res.data;
            setEvents(data);
            setEventInfo(data[data.length - 1]);
        })
    }, [setEvents, setEventInfo])

    useEffect(() => {
        if (eventInfo === undefined) {
            return;
        }
        // let x = eventInfo.line.b / -eventInfo.line.m;
        let hot = Math.round(-eventInfo.line.m * 200);
        setEventHot(hot);
        axios.get(`/final/${eventInfo.id}`).then(res => {
            setFinalScores(res.data);
        })
    }, [eventInfo, setFinalScores, setEventHot])

    useEffect(() => {
        if (finalScores === undefined) {
            return;
        }
        setOption({
            tooltip: {
                trigger: 'axis',
                formatter: function (params: Array<any>) {
                    console.log(params)
                    return `排名: ${params[0].data[0]}<br>PT: ${params[0].data[1]}`
                },
                position: function (pt: any) {
                    return [pt[0], pt[1]];
                }
            },
            toolbox: {
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    restore: {}
                }
            },
            xAxis: {
                type: checked[0] ? 'log' : 'value',
                boundaryGap: false,
                logBase: 10,
            },
            yAxis: {
                type: checked[1] ? 'log' : 'value',
                boundaryGap: false,
                logBase: 10,
            },
            dataZoom: [
                {
                    type: 'inside',
                    start: 0,
                    end: 20
                },
                {
                    start: 0,
                    end: 20
                }
            ],
            series: [
                {
                    name: 'PT',
                    type: 'line',
                    smooth: false,
                    symbol: 'none',
                    areaStyle: {},
                    data: finalScores
                }
            ]
        })
    }, [checked, finalScores])

    const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([event.target.checked, checked[1]]);
    };

    const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([checked[0], event.target.checked]);
    };

    const handleChange = (event: SelectChangeEvent) => {
        let eventId = parseInt(event.target.value as string);
        setEventInfo(events?.find(it => it.id === eventId));
    };
    return (
        <AppBase subtitle="活动最终数据">
            <Grid container spacing={2}>
                {eventInfo &&
                    <Grid item xs={12}>
                        <Alert severity="info">
                            <AlertTitle>关于活动最终数据</AlertTitle>
                            {eventInfo.origin === eventInfo.count &&
                                <div>共<strong>{eventInfo.count}</strong>个数据点。</div>}
                            {eventInfo.origin !== eventInfo.count &&
                                <div>为了优化性能，从{eventInfo.origin}数据中采样了<strong>{eventInfo.count}</strong>个数据点。
                                </div>}
                            {/*估算的活动冲榜难度为<strong>{eventHot}%</strong>。*/}
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
                    <FormControlLabel
                        label="X轴对数"
                        control={<Checkbox checked={checked[0]} onChange={handleChange1}/>}
                    />
                    <FormControlLabel
                        label="Y轴对数"
                        control={<Checkbox checked={checked[1]} onChange={handleChange2}/>}
                    />
                </Grid>
                {option &&
                    <Grid item xs={12}>
                        <EChartsReact style={{height: '700px', maxHeight: '75%', width: '100%'}} option={option}/>
                    </Grid>
                }
            </Grid>
        </AppBase>
    )
}
