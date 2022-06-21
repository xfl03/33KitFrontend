import {useState, useEffect} from 'react';
import {getPjskDownloadInfo, PjskDownloadInfo} from "./download-runtime";

export function usePjskDownloadInfo() {
    const [info, setInfo] = useState<Array<PjskDownloadInfo>>()
    useEffect(() => {
        if (info !== undefined) return;
        getPjskDownloadInfo()
            .then(data => {
                setInfo(data);
            });
    }, [setInfo, info]);
    return info;
}