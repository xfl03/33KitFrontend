import {ChangeEvent, useEffect, useState} from "react";
import {getMusicMetaDisplays, MusicMetaDisplay} from "../../utils/sekai/calculator/music-meta-display";
import AppBase from "../../components/AppBase";
import {Alert, AlertTitle, Checkbox, FormControlLabel, Grid} from "@mui/material";
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import {formatFixed1, formatPercent} from "../../utils/common/value-formatter";

export default function Page() {
    const [musicMetas, setMusicMetas] = useState<MusicMetaDisplay[]>()
    const [multi, setMulti] = useState<boolean>(false)
    useEffect(() => {
        getMusicMetaDisplays(multi).then(it => setMusicMetas(it))
    }, [multi])
    const handleMultiChange = (event: ChangeEvent<HTMLInputElement>) => {
        setMulti(event.target.checked);
    };
    const columns: GridColDef[] = [
        {field: 'title', headerName: '歌名', width: 220, sortable: false},
        {
            field: 'playLevel',
            headerName: '难度',
            width: 80,
            headerAlign: "center",
            align: "center",
            cellClassName: it => `music-${it.row.musicDifficulty}`
        },
        {
            field: 'time',
            headerName: '时长',
            width: 80,
            headerAlign: "center",
            align: "center",
            valueFormatter: formatFixed1
        },
        {
            field: 'scoreRate',
            headerName: '分数',
            width: 80,
            headerAlign: "center",
            align: "center",
            valueFormatter: formatPercent,
            description:"「Live分数」，技能按100%加分效果计算",
        },
        {field: 'eventRate', headerName: '活动', width: 80, headerAlign: "center", align: "center",description:"计算活动PT时使用的「歌曲加成系数」"},
        {field: 'totalNoteCount', headerName: '音符', width: 80, headerAlign: "center", align: "center"},
        {
            field: 'tapPerSecond',
            headerName: '秒击',
            width: 80,
            headerAlign: "center",
            align: "center",
            valueFormatter: formatFixed1,
            description:"「每秒点击数」，不含长条中间与尾部",
        },
        {
            field: 'skillRate',
            headerName: '技能',
            width: 80,
            headerAlign: "center",
            align: "center",
            valueFormatter: formatPercent,
            description:"「技能依赖度」，「Live分数」中有多少比例是技能贡献的",
        },
    ];
    return (
        <AppBase subtitle="歌曲Meta">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Alert severity="info">
                        <AlertTitle>歌曲Meta说明</AlertTitle>
                        「<strong>分数</strong>」指的是「Live分数」，技能按100%加分效果计算。
                        「<strong>技能</strong>」指的是「Live分数」中有多少比例是技能贡献的，也可以叫做「技能依赖度」。
                        「<strong>活动</strong>」指的是计算活动PT时使用的「歌曲加成系数」。
                        「<strong>秒击</strong>」指的是「每秒点击数」，不含长条中间与尾部。
                    </Alert>
                    <FormControlLabel
                        label="多人Live"
                        control={<Checkbox checked={multi} onChange={handleMultiChange}/>}
                    />
                </Grid>
                <Grid item xs={12}>
                    {musicMetas && <DataGrid style={{height: 890, width: 790}} rows={musicMetas} columns={columns}
                                             autoPageSize={true}
                                             initialState={{
                                                 sorting: {
                                                     sortModel: [{field: 'scoreRate', sort: 'desc'}],
                                                 },
                                             }}/>}
                </Grid>
            </Grid>
        </AppBase>)
}

