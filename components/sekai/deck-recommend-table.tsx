import {RecommendDeck} from "sekai-calculator";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import DeckThumbnail from "./deck-thumbnail";
import * as React from "react";

type DeckThumbnailProps = {
    firstTitle: string,
    first: (t: RecommendDeck, i: number) => number | string,
    scoreTitle: string,
    score: (t: RecommendDeck, i: number) => number | string,
    recommend: RecommendDeck[]
}

export default function DeckRecommendTable({firstTitle, first, scoreTitle, score, recommend}: DeckThumbnailProps) {
    if (recommend.length === 0) return (<div></div>)
    // TODO 兼容一下改名了，之后删
    recommend.forEach(it => {
        // @ts-ignore
        if (it.deckCards) it.cards = it.deckCards
    })
    return (<TableContainer component={Paper} style={{maxWidth: "900px"}}>
        <Table size="small">
            <TableHead>
                <TableRow style={{textAlign: "center"}}>
                    <TableCell style={{textAlign: "center"}}>{firstTitle}</TableCell>
                    <TableCell style={{textAlign: "center"}}>{scoreTitle}</TableCell>
                    <TableCell style={{textAlign: "center"}}>对应卡组</TableCell>
                    {recommend[0].eventBonus !== undefined &&
                        <TableCell style={{textAlign: "center"}}>对应加成</TableCell>
                    }
                    <TableCell style={{textAlign: "center"}}>对应综合力</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {recommend.map((it, i) => (
                    <TableRow key={i}>
                        <TableCell style={{textAlign: "center", fontSize: "1rem"}}>
                            <strong>{first(it, i)}</strong>
                        </TableCell>
                        <TableCell style={{textAlign: "center", fontSize: "1rem"}}>
                            {score(it, i)}
                        </TableCell>
                        <TableCell style={{paddingTop: "5px", paddingBottom: "5px"}}>
                            <DeckThumbnail cardIds={it.cards.map(it => it.cardId)}
                                           deckCards={it.cards} size={80}/>
                        </TableCell>
                        {it.eventBonus !== undefined &&
                            <TableCell style={{textAlign: "center", fontSize: "1rem"}}>
                                {it.eventBonus}{it.supportDeckBonus ? `+${it.supportDeckBonus}` : ""}
                            </TableCell>
                        }
                        <TableCell style={{textAlign: "center", fontSize: "1rem"}}
                                   title={`${it.power.base}+${it.power.areaItemBonus}+${it.power.characterBonus}+${it.power.honorBonus}`}
                        >
                            {it.power.total}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>)
}
