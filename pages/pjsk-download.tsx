import * as React from 'react';
import AppBase from "../components/AppBase";
import {loadPjskDownloadInfo, PjskDownloadInfo} from "../utils/pjsk-download";
import {Grid} from "@mui/material";
import PjskDownloadButton from "../components/PjskDownloadButton";

export default function PjskDownload(
    {
        pjskDownloadInfo
    }: {
        pjskDownloadInfo: Array<PjskDownloadInfo>
    }
) {
    return (
        <AppBase subtitle="下载">
            <Grid container spacing={2}>
                {pjskDownloadInfo.map(info => (<PjskDownloadButton key={info.server} info={info}/>))}
            </Grid>
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
