import * as React from 'react';
import AppBase from "../components/AppBase";
import {Alert, AlertTitle, Grid} from "@mui/material";
import PjskDownloadButton from "../components/PjskDownloadButton";
import {usePjskDownloadInfo} from "../utils/download-hook";

export default function PjskDownload() {
    // console.log("PjskDownload")
    const pjskDownloadInfo = usePjskDownloadInfo()
    return (
        <AppBase subtitle="游戏下载">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Alert severity="info">
                        <AlertTitle>关于游戏更新</AlertTitle>
                        目前还暂时需要<strong>手动更新</strong>，若没有及时更新也请<strong>向33反馈</strong>。
                    </Alert>
                </Grid>
                {pjskDownloadInfo && pjskDownloadInfo.map(info => (<PjskDownloadButton key={info.server} info={info}/>))}
            </Grid>
        </AppBase>
    )
}
