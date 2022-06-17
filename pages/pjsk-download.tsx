import Button from '@mui/material/Button'
import * as React from 'react';
import AppBase from "../components/AppBase";
import {loadPjskDownloadInfo, PjskDownloadInfo} from "../utils/pjsk-download";

export default function PjskDownload(
    {
        pjskDownloadInfo
    }: {
        pjskDownloadInfo: Array<PjskDownloadInfo>
    }
) {
    return (
        <AppBase title="下载">
            <Button>新建文件夹</Button>
        </AppBase>
    )
}

export async function getStaticProps() {
    const pjskDownloadInfo = loadPjskDownloadInfo()

    return {
        props: {
            pjskDownloadInfo
        }
    }
}
