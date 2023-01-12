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
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';

export default function CslDownload() {
    const [editions, setEditions] = useState<Array<{ name: string, url: string, detail: any }>>();
    const [downloadDetail, setDownloadDetail] = useState<any>();
    const [mcVersion, setMcVersion] = useState<string>();
    const [downloadItems, setDownloadItems] = useState<Array<any>>();
    const [value, setValue] = React.useState('0');

    const handlePanelChange = (event: React.SyntheticEvent, newValue: string) => {
        setDownloadDetail(editions?.[parseInt(newValue)].detail)
        setValue(newValue);
    };

    const init = async () => {
        const editions0 = [
            {name: "稳定版", url: "https://csl.littleservice.cn/detail.json", detail: undefined},
            {name: "开发版", url: "https://csl.littleservice.cn/detail-beta.json", detail: undefined},
        ];
        for (const edition of editions0) {
            const res = await axios.get(edition.url);
            edition.detail = res.data;
        }
        setEditions(editions0);
        setDownloadDetail(editions0[0].detail)
    }

    useEffect(() => {
        init()
    }, [setEditions]);

    // useEffect(() => {
    //     if (downloadDetail !== undefined) return;
    //     axios.get("https://csl.littleservice.cn/detail.json")
    //         .then(res => {
    //             setDownloadDetail(res.data);
    //         })
    // }, [downloadDetail, setDownloadDetail])

    const handleSelectChange = (event: SelectChangeEvent) => {
        setMcVersion(event.target.value as string);
    };

    useEffect(() => {
        if (downloadDetail === undefined || mcVersion === undefined) return;
        let items = [];
        let obj = downloadDetail.details[mcVersion];
        for (let key in obj) {
            let url = obj[key];
            let name = key.includes(".") ? `${key}原版` : key;
            items.push({
                name, url
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
                        CustomSkinLoader是一款适用于《Minecraft》Java版的皮肤补丁Mod，可以在LittleSkin等皮肤站更换任意想要的皮肤、披风、鞘翅材质。
                        {editions && editions.map(it => it.detail && (<div key={it.name}>
                            当前<strong>{it.name}</strong>为<strong>{it.detail.version}</strong>，最后更新于<strong>{formatDateShort(it.detail.timestamp)}</strong>。
                        </div>))}
                    </Alert>
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{ width: '100%', typography: 'body1' }}>
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handlePanelChange} aria-label="editions">
                                    {editions && editions.map((it,i) =>(
                                        <Tab key={it.name} label={it.name} value={i.toString()} />
                                    ))}
                                </TabList>
                            </Box>
                        </TabContext>
                    </Box>
                    <FormControl style={{marginTop: "10px", marginBottom: "10px"}}>
                        <InputLabel id="event-select-label">Minecraft版本</InputLabel>
                        <Select
                            labelId="event-select-label"
                            id="event-select"
                            value={mcVersion}
                            label="Minecraft版本"
                            onChange={handleSelectChange}
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
                                style={{marginRight: "10px", marginBottom: "10px", textTransform: "none"}}
                                key={it.name} onClick={_ => downloadUrl(it.url)}>{it.name}</Button>
                    )}
                </Grid>
            </Grid>
        </AppBase>
    );
}