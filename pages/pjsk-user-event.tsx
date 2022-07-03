import * as React from 'react';
import AppBase from "../components/AppBase";
import {
    Alert,
    AlertTitle,
    FormControl,
    Grid,
    InputLabel, MenuItem,
    Select, SelectChangeEvent
} from "@mui/material";
import {useEffect, useState} from "react";
import EChartsReact from "echarts-for-react";
import axios from "axios";
import {useRouter} from "next/router";

export default function Page() {
    const [eventId, setEventId] = useState<string>("63");
    const [userId, setUserId] = useState<string>("");
    const [option, setOption] = useState<any>();
    const router = useRouter()
    useEffect(() => {
        let userId0 = router.query.userId
        if(Array.isArray(userId0)){
            userId0 = userId0[0];
        }
        if (userId0 === undefined) {
            let tmp = localStorage.getItem("userId");
            if(tmp === null) {
                return;
            }
            userId0 = tmp;
        }
        setUserId(userId0);

        axios.get(`/user/${userId0}/${eventId}`).then(res => {
            if (typeof userId0 === "string") {
                localStorage.setItem("userId", userId0);
            }
            setOption({
                tooltip: {
                    trigger: 'axis',
                },
                xAxis: {
                    type: eventId == "0" ? 'category' : 'time',
                    boundaryGap: false,
                    // data: res.data.map((it: any) => it.t)
                },
                yAxis: [{
                    name: "PT",
                    type: 'value',
                    boundaryGap: false,
                }, {
                    name: "排名",
                    type: 'value',
                    boundaryGap: false,
                    inverse: true,
                }],
                series: [
                    {
                        name: 'PT',
                        type: 'line',
                        smooth: false,
                        symbol: 'none',
                        data: res.data.map((it: any) => [it.t, it.s]),
                        yAxisIndex: 0
                    },
                    {
                        name: '排名',
                        type: 'line',
                        smooth: false,
                        symbol: 'none',
                        data: res.data.map((it: any) => [it.t, it.r]),
                        yAxisIndex: 1
                    }
                ]
            })
        })
    }, [eventId, setOption, router])

    const handleChange = (event: SelectChangeEvent) => {
        setEventId(event.target.value as string);
    };
    return (
        <AppBase subtitle="个人活动数据">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Alert severity="info">
                        <AlertTitle>关于此功能</AlertTitle>
                        暂时仅限部分特定用户使用。
                    </Alert>
                </Grid>
                <Grid item xs={12}>
                    <FormControl>
                        <InputLabel id="event-select-label">{userId}的活动</InputLabel>
                        <Select
                            labelId="event-select-label"
                            id="event-select"
                            value={eventId}
                            label="活动"
                            onChange={handleChange}
                            style={{minWidth:"200px"}}
                        >
                            <MenuItem value={0}>历史活动</MenuItem>
                            <MenuItem value={63}>63</MenuItem>
                        </Select>
                    </FormControl>
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
