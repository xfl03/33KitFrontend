import * as React from 'react';
import AppBase from "../components/AppBase";
import {
    Alert,
    AlertTitle, Box, Chip,
    FormControl,
    Grid,
    // IconButton,
    InputLabel, MenuItem, OutlinedInput,
    Select, SelectChangeEvent, Theme, useTheme
} from "@mui/material";
import {useEffect, useState} from "react";
import EChartsReact from "echarts-for-react";
// import axios from "axios";
// import {useRouter} from "next/router";
// import {Refresh} from "@mui/icons-material";
import {
    eventRanks,
    getEventRanks,
    // processDetailMessages,
    // UserDetailMessage,
    // UserEventData
} from "../utils/user-event-data";
import {DynamicEcharts} from "../components/dynamic-echarts";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

export default function Page() {
    const [eventId, setEventId] = useState<string>("");
    const [ranks, setRanks] = useState<Array<string>>([]);
    const [allRanks, setAllRanks] = useState<Array<string>>([]);
    // const [userId, setUserId] = useState<string>("");
    const [option, setOption] = useState<any>();
    const [events, setEvents] = useState<Array<any>>([]);
    // const [eventData, setEventData] = useState<Array<UserEventData>>([]);
    // const [latestScore, setLatestScore] = useState<number>(0);
    // const [detailMessages, setDetailMessages] = useState<Array<UserDetailMessage>>([]);
    // const [refreshFlag, setRefreshFlag] = useState<boolean>(false);
    // const [echartRef, setEchartRef] = useState<EChartsReact>();
    const [index, setIndex] = useState<any>({});
    // const router = useRouter()
    const theme = useTheme();

    useEffect(() => {
        fetch(process.env.NEXT_PUBLIC_SEKAI_DATA_BASE + "event/data/index.json")
            .then(res => res.json())
            .then(json => {
                setIndex(json)
                const events0 = Object.keys(json).map(it => parseInt(it))
                setEvents(events0)
                setEventId(events0[events0.length - 1].toString())
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
                        // data: res.data.map((it: any) => it.t)
                    },
                    yAxis: [{
                        name: "PT",
                        type: 'value',
                        boundaryGap: false,
                    }]
                })
            })
    }, [setIndex, setEvents, setEventId])

// useEffect(() => {
//     let userId0 = router.query.userId
//     if (Array.isArray(userId0)) {
//         userId0 = userId0[0];
//     }
//     console.log(`userId in param: ${userId0}`);
//     if (userId0 === undefined) {
//         let tmp = localStorage.getItem("userId");
//         if (tmp === null) {
//             return;
//         }
//         userId0 = tmp;
//     }
//     setUserId(userId0);
// }, [router.query.userId, setUserId])

// useEffect(() => {
//     if (userId === "") return;
//     axios.get(`${process.env.NEXT_PUBLIC_USER_EVENT_BASE}/user-data/${userId}.json`).then(res => {
//         localStorage.setItem("userId", userId);
//         let data = res.data;
//         setEvents(data);
//         let eventId = data[data.length - 1].id.toString();
//         setEventId(eventId);
//         setOption({
//             tooltip: {
//                 trigger: 'axis',
//             },
//             toolbox: {
//                 feature: {
//                     dataZoom: {
//                         yAxisIndex: 'none'
//                     },
//                     restore: {}
//                 }
//             },
//             dataZoom: [
//                 {
//                     type: 'inside',
//                     start: 0,
//                     end: 100
//                 },
//                 {
//                     start: 0,
//                     end: 100
//                 }
//             ],
//             xAxis: {
//                 type: eventId == "0" ? 'category' : 'time',
//                 boundaryGap: false,
//                 // data: res.data.map((it: any) => it.t)
//             },
//             yAxis: [{
//                 name: "PT",
//                 type: 'value',
//                 boundaryGap: false,
//             }, {
//                 name: "排名",
//                 type: 'value',
//                 boundaryGap: false,
//                 inverse: true,
//             }]
//         })
//     })
// }, [userId, setEvents, setOption])

    useEffect(() => {
        if (index === undefined || eventId === "") return
        setAllRanks(index[eventId].map((it: number) => it.toString()))
        setRanks([])
    }, [eventId, setRanks, setAllRanks, index])

    useEffect(() => {
        // if (userId === "" || eventId === "") return;
        if (eventId === "" || ranks.length === 0) return;

        const series: any[] = [];
        getEventRanks(eventId, ranks)
            .then(it => {
                //Add compare rank data
                it.forEach(rank => {
                    series.push({
                        name: rank.rank,
                        type: 'line',
                        smooth: false,
                        symbol: 'none',
                        data: rank.data.map(it => [it.timestamp, it.score]),
                        yAxisIndex: 0
                    })
                })
                // })
                // .then(_ => axios.get(`${process.env.NEXT_PUBLIC_USER_EVENT_BASE}/user-data/${userId}/${eventId}.json`))
                // .then(res => {
                //     setEventData(res.data);
                //     const data: Array<{ t: number, r: number, s: number }> = res.data;
                //
                //     processDetailMessages(eventId, data, setLatestScore, setDetailMessages);
                //
                //     series.push({
                //         name: 'PT',
                //         type: 'line',
                //         smooth: false,
                //         symbol: 'none',
                //         data: data.map(it => [it.t, it.s]),
                //         yAxisIndex: 0
                //     });
                //     series.push({
                //         name: '排名',
                //         type: 'line',
                //         smooth: false,
                //         symbol: 'none',
                //         data: data.map(it => [it.t, it.r]),
                //         yAxisIndex: 1
                //     });

                console.log(`series.length=${series.length}`)
                setOption({
                    series: series
                })
            })
        // }, [userId, eventId, setOption, refreshFlag, ranks])
    }, [setOption, ranks])

    const handleChange = (event: SelectChangeEvent) => {
        setEventId(event.target.value as string);
    };
    const handleChange1 = (event: SelectChangeEvent<typeof ranks>) => {
        const {
            target: {value},
        } = event;
        // console.log(value)
        setRanks(
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    return (
        <AppBase subtitle="活动PT数据">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Alert severity="info">
                        <AlertTitle>关于此功能</AlertTitle>
                        因为游戏服务器限制，部分PT数据存在大面积缺失。
                    </Alert>
                </Grid>
                <Grid item xs={12}>
                    <FormControl>
                        {/*<InputLabel id="event-select-label">{userId}的活动</InputLabel>*/}
                        <InputLabel id="event-select-label">活动</InputLabel>
                        <Select
                            labelId="event-select-label"
                            id="event-select"
                            value={eventId}
                            label="活动"
                            onChange={handleChange}
                            style={{minWidth: "340px"}}
                        >
                            {/*<MenuItem value={0}>历史活动</MenuItem>*/}
                            {events.map(it =>
                                // <MenuItem key={it.id} value={it.id}>{it.id} - {it.name}</MenuItem>
                                <MenuItem key={it} value={it}>{it}</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel id="demo-multiple-chip-label">档线</InputLabel>
                        <Select
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            // multiple
                            value={ranks}
                            onChange={handleChange1}
                            input={<OutlinedInput id="select-multiple-chip" label="Chip"/>}
                            // renderValue={(selected) => (
                            //     <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                            //         {selected.map((value) => (
                            //             <Chip key={value} label={value}/>
                            //         ))}
                            //     </Box>
                            // )}
                            MenuProps={MenuProps}
                            style={{minWidth: "280px"}}
                        >
                            {allRanks && allRanks.map((name) => (
                                <MenuItem
                                    key={name}
                                    value={name}
                                    style={getStyles(name, ranks, theme)}
                                >
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {/*<IconButton onClick={_ => setRefreshFlag(!refreshFlag)} style={{marginTop: "2px"}}>*/}
                    {/*    <Refresh fontSize="large"/>*/}
                    {/*</IconButton>*/}
                </Grid>
                {/*<Grid xs={12}>*/}
                {/*    {eventData.length > 0 && <div style={{display: "inline-block", fontSize: "20px"}}>*/}
                {/*        分数<b>{eventData[eventData.length - 1].s}</b>&nbsp;*/}
                {/*        排名<b>{eventData[eventData.length - 1].r}</b>&nbsp;*/}
                {/*    </div>}*/}
                {/*    {latestScore !== 0 && <div style={{display: "inline-block", fontSize: "20px"}}>*/}
                {/*        最近1次<b>{latestScore}</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*/}
                {/*    </div>}*/}
                {/*    {detailMessages.length > 0 && <div style={{display: "inline-block"}}>*/}
                {/*        {detailMessages.map(it => (*/}
                {/*            <div key={it.text} style={{display: "inline-block", fontSize: "20px"}}>*/}
                {/*                最近{it.text}<b>{it.count}</b>次*/}
                {/*                {it.count > 0 &&*/}
                {/*                    <div style={{display: "inline-block"}}><b>{it.score}</b>*/}
                {/*                        (平均<b>{(it.score / it.count).toFixed(0)}</b>)*/}
                {/*                    </div>}&nbsp;*/}
                {/*            </div>))}*/}
                {/*    </div>}*/}
                {/*</Grid>*/}
                {option &&
                    <Grid item xs={12}>
                        <DynamicEcharts
                            // ref={(e) => {
                            //     if (e && !echartRef) {
                            //         setEchartRef(e);
                            //     }
                            // }}
                            option={option}
                        />
                    </Grid>
                }
            </Grid>
        </AppBase>
    )
}
