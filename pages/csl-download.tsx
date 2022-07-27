import {useEffect, useState} from "react";
import AppBase from "../components/AppBase";
import {
    Alert,
    AlertTitle,
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent
} from "@mui/material";
import * as React from "react";
import axios from "axios";
import {formatDateShort} from "../utils/date-format";
import {downloadUrl} from "../utils/download-runtime";
import {CloudDownload} from "@mui/icons-material";

export default function CslDownload() {
    const [downloadDetail, setDownloadDetail] = useState<any>();
    const [mcVersion, setMcVersion] = useState<string>();
    const [downloadItems, setDownloadItems] = useState<Array<any>>();

    useEffect(() => {
        if (downloadDetail !== undefined) return;
        axios.get("https://csl.littleservice.cn/detail.json")
            .then(res => {
                setDownloadDetail(res.data);
            })
    }, [downloadDetail, setDownloadDetail])

    const handleChange = (event: SelectChangeEvent) => {
        setMcVersion(event.target.value as string);
    };

    useEffect(() => {
        if (downloadDetail === undefined || mcVersion === undefined) return;
        let items = [];
        let obj = downloadDetail.details[mcVersion];
        for(let key in obj){
            let url = obj[key];
            let name = key.includes(".")?`${key}原版`:key;
            items.push({
                name,url
            })
        }
        setDownloadItems(items);
    }, [downloadDetail, mcVersion])

    return (
        <AppBase subtitle={"CustomSkinLoader 下载"}>
            <Grid container>
                <Grid item xs={12}>
                    <Alert severity="info">
                        <AlertTitle>关于CustomSkinLoader</AlertTitle>
                        CustomSkinLoader是一款适用于《Minecraft》Java版的皮肤补丁Mod。
                        {downloadDetail && (<div>
                            当前版本为<strong>{downloadDetail.version}</strong>，最后更新于<strong>{formatDateShort(downloadDetail.timestamp)}</strong>。
                        </div>)}
                    </Alert>
                </Grid>
                <Grid item xs={12}>
                    <FormControl style={{marginTop:"10px",marginBottom:"10px"}}>
                        <InputLabel id="event-select-label">Minecraft版本</InputLabel>
                        <Select
                            labelId="event-select-label"
                            id="event-select"
                            value={mcVersion}
                            label="Minecraft版本"
                            onChange={handleChange}
                            style={{minWidth: "340px"}}
                        >
                            {downloadDetail && Object.keys(downloadDetail.details).map((it: string) =>
                                <MenuItem key={it} value={it}>{it}</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    {downloadItems && downloadItems.map((it: any) =>
                        <Button variant="contained" startIcon={<CloudDownload/>}
                                style={{marginRight:"10px",marginBottom:"10px",textTransform:"none"}}
                                key={it.name} onClick={_ => downloadUrl(it.url)}>{it.name}</Button>
                    )}
                </Grid>
            </Grid>
        </AppBase>
    );
}