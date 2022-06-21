import {useState, useEffect} from 'react';
import {getPjskDownloadInfoWithCallback, PjskDownloadInfo} from "./download-runtime";

export function usePjskDownloadInfo() {
    const [info, setInfo] = useState<Array<PjskDownloadInfo>>()
    useEffect(() => {
        getPjskDownloadInfoWithCallback(setInfo)
    }, [setInfo]);
    return info;
}