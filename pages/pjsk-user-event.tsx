import * as React from 'react';
import AppBase from "../components/AppBase";
import {
    Alert,
    AlertTitle,
    FormControl,
    Grid, IconButton,
    InputLabel, MenuItem,
    Select, SelectChangeEvent
} from "@mui/material";
import {useEffect, useState} from "react";
import EChartsReact from "echarts-for-react";
import axios from "axios";
import {useRouter} from "next/router";
import {Refresh} from "@mui/icons-material";
import {getChangedData} from "../utils/user-event-data";

export default function Page() {
    const [eventId, setEventId] = useState<string>("");
    const [userId, setUserId] = useState<string>("");
    const [option, setOption] = useState<any>();
    const [events, setEvents] = useState<Array<any>>([]);
    const [eventData, setEventData] = useState<Array<any>>([]);
    const [latestScore, setLatestScore] = useState<number>(0);
    const [detailMessages, setDetailMessages] = useState<Array<any>>([]);
    const [refreshFlag, setRefreshFlag] = useState<boolean>(false);
    // const [echartRef, setEchartRef] = useState<EChartsReact>();
    const router = useRouter()

    useEffect(() => {
        let userId0 = router.query.userId
        if (Array.isArray(userId0)) {
            userId0 = userId0[0];
        }
        console.log(`userId in param: ${userId0}`);
        if (userId0 === undefined) {
            let tmp = localStorage.getItem("userId");
            if (tmp === null) {
                return;
            }
            userId0 = tmp;
        }
        setUserId(userId0);
    }, [router.query.userId, setUserId])

    useEffect(() => {
        if (userId === "") return;
        axios.get(`/user/${userId}`).then(res => {
            localStorage.setItem("userId", userId);
            let data = res.data;
            setEvents(data);
            let eventId = data[data.length - 1].id.toString();
            setEventId(eventId);
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
                }]
            })
        })
    }, [userId, setEvents, setOption])

    useEffect(() => {
        if (userId === "" || eventId === "") return;
        axios.get(`/user/${userId}/${eventId}`).then(res => {
            setEventData(res.data);
            const data = res.data;

            //Calculate speed and times for advanced user
            if (data.length >= 2) {
                const maxGapTime = 11 * 60 * 1000;//Gap is less than 11 min
                const latestGap = data[data.length - 1].t - data[data.length - 2].t;
                //Only if time gap is shorter than max, which can get detailed data
                if (latestGap <= maxGapTime) {
                    let changedData = getChangedData(data);
                    let latestData = data[data.length - 1];
                    setLatestScore(latestData.s - changedData[changedData.length - 2].s);

                    //Used in detailed message
                    //It must be written in time order
                    const displayDetails = [
                        {
                            time: 60 * 60 * 1000,
                            text: "1小时"
                        },
                        {
                            time: 24 * 60 * 60 * 1000,
                            text: "24小时"
                        },
                    ];
                    //The detailedDisplay select
                    let detailPtr = 0;
                    let detail = displayDetails[0];
                    let detailMessage = [] as any[];
                    //Reverse for in changedData
                    for (let i = changedData.length - 1; i >= 0; --i) {
                        let current = changedData[i];
                        //Judge if detail is fulfilled
                        if (latestData.t - current.t > detail.time) {
                            // console.log(current);
                            detailMessage.push({
                                text: detail.text,
                                count: changedData.length - 1 - i,
                                score: latestData.s - current.s
                            });
                            detailPtr++;
                            //Check displayDetails is all fulfilled
                            if (detailPtr >= displayDetails.length) {
                                break;
                            }
                            detail = displayDetails[detailPtr];
                        }
                    }
                    setDetailMessages(detailMessage);
                    // console.log(detailMessages);
                }
            }

            setOption({
                series: [
                    {
                        name: 'PT',
                        type: 'line',
                        smooth: false,
                        symbol: 'none',
                        data: data.map((it: any) => [it.t, it.s]),
                        yAxisIndex: 0
                    },
                    {
                        name: '排名',
                        type: 'line',
                        smooth: false,
                        symbol: 'none',
                        data: data.map((it: any) => [it.t, it.r]),
                        yAxisIndex: 1
                    }
                ]
            })
        })
    }, [userId, eventId, setOption, refreshFlag])

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
                            style={{minWidth: "340px"}}
                        >
                            <MenuItem value={0}>历史活动</MenuItem>
                            {events.map(it =>
                                <MenuItem key={it.id} value={it.id}>{it.id} - {it.name}</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                    <IconButton onClick={_ => setRefreshFlag(!refreshFlag)} style={{marginTop: "2px"}}>
                        <Refresh fontSize="large"/>
                    </IconButton>
                    {eventData.length > 0 && <div style={{display: "inline-block", fontSize: "20px"}}>
                        分数<b>{eventData[eventData.length - 1].s}</b>&nbsp;
                        排名<b>{eventData[eventData.length - 1].r}</b>&nbsp;
                    </div>}
                    {latestScore && <div style={{display: "inline-block", fontSize: "20px"}}>
                        最近1次<b>{latestScore}</b>&nbsp;<br/>
                    </div>}
                    {detailMessages.length > 0 && <div>
                        {detailMessages.map(it => (
                            <div key={it.text} style={{display: "inline-block", fontSize: "20px"}}>
                                最近{it.text}<b>{it.count}</b>次<b>{it.score}</b>
                                (平均<b>{(it.score / it.count).toFixed(0)}</b>)&nbsp;
                            </div>))}
                    </div>}
                </Grid>
                {option &&
                    <Grid item xs={12}>
                        <EChartsReact
                            // ref={(e) => {
                            //     if (e && !echartRef) {
                            //         setEchartRef(e);
                            //     }
                            // }}
                            style={{height: '700px', maxHeight: '75%', width: '100%'}}
                            option={option}
                        />
                    </Grid>
                }
            </Grid>
        </AppBase>
    )
}
