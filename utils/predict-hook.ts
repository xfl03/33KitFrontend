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