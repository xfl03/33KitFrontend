import {useEffect, useState} from "react";
import axios from "axios";

export function usePjskPredict() {
    const [info, setInfo] = useState<any>()
    useEffect(() => {
        if (info) return;
        axios.get(process.env.NEXT_PUBLIC_SEKAI_DATA_BASE + "predict.json").then(res => {
            setInfo(res.data)
        })
    }, [setInfo, info]);
    return info;
}

export function usePjskCheerfulPredict() {
    const [info, setInfo] = useState<any>()
    useEffect(() => {
        if (info) return;
        axios.get(process.env.NEXT_PUBLIC_SEKAI_DATA_BASE + "cheerful_predict.json").then(res => {
            setInfo(res.data)
        })
    }, [setInfo, info]);
    return info;
}
