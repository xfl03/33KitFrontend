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
    const [eventId, setEventId] = useState<string>("62");
    const [finalScores, setFinalScores] = useState<Array<any>>();
    const [option, setOption] = useState<any>();
    const [checked, setChecked] = React.useState([true, true]);
    useEffect(() => {
        axios.get(`/final/${eventId}`).then(res => {
            setFinalScores(res.data);
            setOption({
                tooltip: {
                    trigger: 'axis',
                    position: function (pt: any) {
                        return [pt[0], '100%'];
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
                        data: res.data
                    }
                ]
            })
        })
    }, [eventId, setFinalScores, setOption, checked])

    const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([event.target.checked, checked[1]]);
    };

    const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([checked[0], event.target.checked]);
    };

    const handleChange = (event: SelectChangeEvent) => {
        setEventId(event.target.value as string);
    };
    return (
        <AppBase subtitle="活动最终数据">
            <Grid container spacing={2}>
                {finalScores &&
                    <Grid item xs={12}>
                        <Alert severity="info">
                            <AlertTitle>关于活动最终数据</AlertTitle>
                            下图是活动<strong>{eventId}</strong>的数据，为了优化性能，从11万数据中采样了<strong>{finalScores.length}</strong>个数据点。
                        </Alert>
                    </Grid>}
                <Grid item xs={12}>
                    <FormControl>
                        <InputLabel id="event-select-label">活动</InputLabel>
                        <Select
                            labelId="event-select-label"
                            id="event-select"
                            value={eventId}
                            label="活动"
                            onChange={handleChange}
                        >
                            <MenuItem value={62}>絶体絶命！？アイランドパニック！</MenuItem>
                        </Select>
                    </FormControl>
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
                        <EChartsReact style={{height: '700px', maxHeight: '90%', width: '100%'}} option={option}/>
                    </Grid>
                }
            </Grid>
        </AppBase>
    )
}
