import {useEffect, useState, MouseEvent} from "react";
import {getMusicMetaDisplays, MusicMetaDisplay} from "../../utils/sekai/calculator/music-meta-display";
import AppBase from "../../components/AppBase";
import {Alert, AlertTitle, Grid, Stack, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {DataGrid, GridColDef, GridRenderCellParams, GridToolbar} from '@mui/x-data-grid';
import {formatFixed1, formatPercent, formatPercentForGrid} from "../../utils/common/value-formatter";

export default function Page() {
    const [musicMetas, setMusicMetas] = useState<MusicMetaDisplay[]>()
    const [server, setServer] = useState<string>("jp")
    const [liveType, setLiveType] = useState<string>("solo")
    useEffect(() => {
        getMusicMetaDisplays(server, liveType).then(it => setMusicMetas(it))
    }, [server, liveType])
    const handleServerChange = (event: MouseEvent<HTMLElement>, value: string | null) => {
        if (value === null) return
        setServer(value)
    };
    const handleLiveTypeChange = (event: MouseEvent<HTMLElement>, value: string | null) => {
        if (value === null) return
        setLiveType(value)
    };
    const renderSkillCell = (params: GridRenderCellParams<MusicMetaDisplay, number>) => (
        <Grid title={params.row.skillDetails.map(it => formatPercent(it)).join(" ")}>{formatPercent(params.value)}</Grid>
    )
    const columns: GridColDef[] = [
        {field: 'title', headerName: '歌名', width: 220, sortable: false},
        {
            field: 'playLevel',
            headerName: '难度',
            width: 80,
            headerAlign: "center",
            align: "center",
            cellClassName: it => `music-${it.row.musicDifficulty}`,
        },
        {
            field: 'time',
            headerName: '时长',
            width: 80,
            headerAlign: "center",
            align: "center",
            valueFormatter: formatFixed1,
        },
        {
            field: 'scoreRate',
            headerName: '分数',
            width: 80,
            headerAlign: "center",
            align: "center",
            valueFormatter: formatPercentForGrid,
            description: "「Live分数」，技能按100%加分效果计算",
        },
        {
            field: 'eventRate',
            headerName: '活动',
            width: 80,
            headerAlign: "center",
            align: "center",
            description: "计算活动PT时使用的「歌曲加成系数」",
        },
        {
            field: 'totalNoteCount',
            headerName: '音符',
            width: 80,
            headerAlign: "center",
            align: "center",
        },
        {
            field: 'tapPerSecond',
            headerName: '秒击',
            width: 80,
            headerAlign: "center",
            align: "center",
            valueFormatter: formatFixed1,
            description: "「每秒点击数」，不含长条中间、尾部和Trace",
        },
        {
            field: 'skillRate',
            headerName: '技能',
            width: 80,
            headerAlign: "center",
            align: "center",
            valueFormatter: formatPercentForGrid,
            description: "「技能依赖度」，「Live分数」中有多少比例是技能贡献的",
            renderCell: renderSkillCell,
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
                        「<strong>秒击</strong>」指的是「每秒点击数」，不含长条中间、尾部和Trace。
                    </Alert>
                    <Stack direction="row" spacing={1} style={{ marginTop: "10px" }}>
                        <ToggleButtonGroup
                            color="primary"
                            value={server}
                            exclusive
                            onChange={handleServerChange}
                            aria-label="Platform"
                        >
                            <ToggleButton value="jp">日</ToggleButton>
                            <ToggleButton value="cn">简</ToggleButton>
                            <ToggleButton value="tc">繁</ToggleButton>
                            <ToggleButton value="en">英</ToggleButton>
                            <ToggleButton value="kr">韩</ToggleButton>
                        </ToggleButtonGroup>
                    </Stack>
                    <Stack direction="row" spacing={1} style={{ marginTop: "10px" }}>
                        <ToggleButtonGroup
                            color="primary"
                            value={liveType}
                            exclusive
                            onChange={handleLiveTypeChange}
                            aria-label="Platform"
                        >
                            <ToggleButton value="solo">单人Live</ToggleButton>
                            <ToggleButton value="multi">多人Live</ToggleButton>
                            <ToggleButton value="auto">自动Live</ToggleButton>
                        </ToggleButtonGroup>
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    {musicMetas && <DataGrid style={{height: 890, width: 790}} rows={musicMetas} columns={columns}
                                             autoPageSize={true}
                                             disableColumnMenu={true}
                                             slots={{ toolbar: GridToolbar }}
                                             initialState={{
                                                 sorting: {
                                                     sortModel: [{field: 'scoreRate', sort: 'desc'}],
                                                 },
                                             }}/>}
                </Grid>
            </Grid>
        </AppBase>)
}