import {useEffect, useState} from "react";
import axios from "axios";

export function usePjskPredict() {
    const [info, setInfo] = useState<any>()
    useEffect(() => {
        if (info) return;
        axios.get("/pred").then(res => {
            setInfo(res.data)
        })
    }, [setInfo, info]);
    return info;
}

export function usePjskCheerfulPredict() {
    const [info, setInfo] = useState<any>()
    useEffect(() => {
        if (info) return;
        axios.get("/cheer-pred").then(res => {
            setInfo(res.data)
        })
    }, [setInfo, info]);
    return info;
}