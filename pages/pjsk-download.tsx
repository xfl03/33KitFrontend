import * as React from 'react';
import AppBase from "../components/AppBase";
import {Alert, AlertTitle, Grid} from "@mui/material";
import PjskDownloadButton from "../components/PjskDownloadButton";
import {getPjskDownloadInfo, PjskDownloadInfo} from "../utils/download-runtime";

export default function PjskDownload(
    {
        pjskDownloadInfo
    }: {
        pjskDownloadInfo: Array<PjskDownloadInfo>
    }
) {
    // console.log("PjskDownload")
    return (
        <AppBase subtitle="下载">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Alert severity="info">
                        <AlertTitle>关于游戏更新</AlertTitle>
                        目前还暂时需要<strong>手动更新</strong>，若没有及时更新也请<strong>向33反馈</strong>。
                    </Alert>
                </Grid>
                {pjskDownloadInfo.map(info => (<PjskDownloadButton key={info.server} info={info}/>))}
            </Grid>
        </AppBase>
    )
}

export async function getServerSideProps() {
    const pjskDownloadInfo = await getPjskDownloadInfo()

    return {
        props: {
            pjskDownloadInfo
        }
    }
}
