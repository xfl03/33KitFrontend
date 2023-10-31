import {useEffect, useState} from "react";

const PREDICT_URL = process.env.NEXT_PUBLIC_SEKAI_DATA_BASE + "predict.json"
const CHEERFUL_PREDICT_URL = process.env.NEXT_PUBLIC_SEKAI_DATA_BASE + "cheerful_predict.json"
export function usePjskPredict() {
    const [info, setInfo] = useState<any>()
    useEffect(() => {
        if (info) return;
        fetch(PREDICT_URL)
            .then(res => res.json())
            .then(res => {
                setInfo(res)
            })
    }, [setInfo, info]);
    return info;
}

export async function getPjskPredict() {
    let res = await fetch(PREDICT_URL);
    return await res.json();
}

export function usePjskCheerfulPredict() {
    const [info, setInfo] = useState<any>()
    useEffect(() => {
        if (info) return;
        fetch(CHEERFUL_PREDICT_URL)
            .then(res => res.json())
            .then(res => {
                setInfo(res)
            })
    }, [setInfo, info]);
    return info;
}

export async function getPjskCheerfulPredict() {
    let res = await fetch(CHEERFUL_PREDICT_URL);
    return await res.json()
}
