import {useTopDeck} from "../../utils/sekai/calculator/top-deck-recommend";
import AppBase from "../../components/AppBase";
import {Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import DeckThumbnail from "../../components/sekai/deck-thumbnail";
import React from "react";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import {TabPanel} from "@mui/lab";

export default function Page() {
    const topDeck = useTopDeck()
    const [value, setValue] = React.useState('1');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };
    return (<AppBase subtitle="最佳卡组">
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Box sx={{width: '100%', typography: 'body1'}}>
                    <TabContext value={value}>
                        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                <Tab label="挑战Live卡组" value="1"/>
                                <Tab label="活动卡组" value="2"/>
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            {topDeck &&
                                <TableContainer component={Paper} style={{maxWidth: "900px"}}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow style={{textAlign: "center"}}>
                                                <TableCell style={{textAlign: "center"}}>角色</TableCell>
                                                <TableCell style={{textAlign: "center"}}>最高分数</TableCell>
                                                <TableCell style={{textAlign: "center"}}>对应卡组</TableCell>
                                                <TableCell style={{textAlign: "center"}}>对应综合力</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {topDeck.challenge.map(it => (
                                                <TableRow key={it.character}>
                                                    <TableCell style={{textAlign: "center", fontSize: "1rem"}}>
                                                        <strong>{it.character}</strong>
                                                    </TableCell>
                                                    <TableCell style={{textAlign: "center", fontSize: "1rem"}}>
                                                        {it.score}
                                                    </TableCell>
                                                    <TableCell style={{paddingTop: "5px", paddingBottom: "5px"}}>
                                                        <DeckThumbnail cardIds={it.cards} size={80}/>
                                                    </TableCell>
                                                    <TableCell style={{textAlign: "center", fontSize: "1rem"}}>
                                                        {it.power}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            }
                        </TabPanel>
                        <TabPanel value="2">
                            {topDeck &&
                                <TableContainer component={Paper} style={{maxWidth: "900px"}}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow style={{textAlign: "center"}}>
                                                <TableCell style={{textAlign: "center"}}>排名</TableCell>
                                                <TableCell style={{textAlign: "center"}}>10火孜然PT</TableCell>
                                                <TableCell style={{textAlign: "center"}}>对应卡组</TableCell>
                                                <TableCell style={{textAlign: "center"}}>对应加成</TableCell>
                                                <TableCell style={{textAlign: "center"}}>对应综合力</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {topDeck.event.map((it, i) => (
                                                <TableRow key={i}>
                                                    <TableCell style={{textAlign: "center", fontSize: "1rem"}}>
                                                        <strong>{i + 1}</strong>
                                                    </TableCell>
                                                    <TableCell style={{textAlign: "center", fontSize: "1rem"}}>
                                                        {it.point * 35}
                                                    </TableCell>
                                                    <TableCell style={{paddingTop: "5px", paddingBottom: "5px"}}>
                                                        <DeckThumbnail cardIds={it.cards} size={80}/>
                                                    </TableCell>
                                                    <TableCell style={{textAlign: "center", fontSize: "1rem"}}>
                                                        {it.eventBonus}
                                                    </TableCell>
                                                    <TableCell style={{textAlign: "center", fontSize: "1rem"}}>
                                                        {it.power}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            }
                        </TabPanel>
                    </TabContext>
                </Box>
            </Grid>
        </Grid>
    </AppBase>)
}


