import {useTopDeck} from "../../utils/sekai/calculator/top-deck-recommend";
import AppBase from "../../components/AppBase";
import {Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import DeckThumbnail from "../../components/sekai/deck-thumbnail";

export default function Page() {
    const topDeck = useTopDeck()
    return (<AppBase subtitle="最佳卡组">
        <Grid container spacing={2}>
            <Grid item xs={12}>
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
                                        <TableCell style={{
                                            textAlign: "center",
                                            fontSize: "1rem"
                                        }}><strong>{it.character}</strong></TableCell>
                                        <TableCell
                                            style={{textAlign: "center", fontSize: "1rem"}}>{it.score}</TableCell>
                                        <TableCell style={{paddingTop: "5px", paddingBottom: "5px"}}><DeckThumbnail
                                            cardIds={it.cards} size={80}/></TableCell>
                                        <TableCell
                                            style={{textAlign: "center", fontSize: "1rem"}}>{it.power}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                }
            </Grid>
        </Grid>
    </AppBase>)
}


