import {useTopDeck} from "../../utils/sekai/calculator/top-deck-recommend";
import AppBase from "../../components/AppBase";
import React from "react";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import {Box, Grid, Tab} from "@mui/material";
import useGameCharacters, {getCharacterName} from "../../utils/sekai/master/character-hook";
import DeckRecommendTable from "../../components/sekai/deck-recommend-table";

export default function Page() {
    const topDeck = useTopDeck()
    const characters = useGameCharacters()
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
                            {topDeck && characters &&
                                <DeckRecommendTable firstTitle="角色"
                                                    first={(_, i) => getCharacterName(characters.find(it => it.id === i + 1)!)}
                                                    scoreTitle="最高分数" score={(it) => it.score}
                                                    recommend={topDeck.challenge}/>
                            }
                        </TabPanel>
                        <TabPanel value="2">
                            {topDeck &&
                                <DeckRecommendTable firstTitle="排名"
                                                    first={(_, i) => i + 1}
                                                    scoreTitle="10火孜然PT" score={(it) => it.score * 35}
                                                    recommend={topDeck.challenge}/>
                            }
                        </TabPanel>
                    </TabContext>
                </Box>
            </Grid>
        </Grid>
    </AppBase>)
}


