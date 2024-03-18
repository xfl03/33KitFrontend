import React from "react";
import axios from "axios";

export interface UserEventData {
    t: number,
    r: number,
    s: number
}

export interface UserDetailMessage {
    text: string,
    count: number,
    score: number
}

export interface EventRankData {
    standardTimestamp: number,
    timestamp: number,
    score: number
}

export function getChangedData(data: Array<UserEventData>) {
    let ret = [data[0]];
    for (let i = 1; i < data.length; ++i) {
        let latestRet = ret[ret.length - 1];
        let currentData = data[i];
        //Score changed
        if (latestRet.s < currentData.s) {
            ret.push(currentData);
        } else if (latestRet.s > currentData.s) {
            //Remove shaking data
            ret.pop();
        }
    }
    // console.log(ret);
    return ret;
}

export function processDetailMessages(
    eventId: string, data: Array<UserEventData>,
    setLatestScore: React.Dispatch<React.SetStateAction<number>>,
    setDetailMessages: React.Dispatch<React.SetStateAction<Array<UserDetailMessage>>>
) {
    //Calculate speed and times for advanced user
    if (eventId !== "0" && data.length >= 2) {
        const maxGapTime = 11 * 60 * 1000;//Gap is less than 11 min
        const latestGap = data[data.length - 1].t - data[data.length - 2].t;
        //Only if time gap is shorter than max, which can get detailed data
        if (latestGap <= maxGapTime) {
            let changedData = getChangedData(data);
            let latestData = data[data.length - 1];
            if (changedData.length >= 2) {
                setLatestScore(changedData[changedData.length - 1].s - changedData[changedData.length - 2].s);
            }

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
            let detailMessage: Array<UserDetailMessage> = [];
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
}

export async function getEventRank(eventId: string, rank: string) {
    let res = await axios.get(`${process.env.NEXT_PUBLIC_SEKAI_DATA_BASE}event/data/${eventId}/${rank}.json`);
    return res.data;
}

export async function getEventRanks(eventId: string, ranks: string[]) {
    let ret: Array<{ rank: string, data: Array<EventRankData> }> = [];
    for (let rank of ranks) {
        ret.push({
            rank: rank,
            data: await getEventRank(eventId, rank),
        });
    }
    return ret;
}

export const eventRanks = [
    "1", "2", "3", "4", "5", "10", "20", "30", "40", "50", "100", "200", "300", "400", "500", "1000", "2000", "3000",
    "4000", "5000", "10000", "20000", "30000", "40000", "50000", "100000"
];
