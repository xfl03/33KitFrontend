import CardThumbnail from "./card-thumbnail";
import {Stack} from "@mui/material";
import {Card} from "sekai-calculator";

type DeckThumbnailProps = {
    cards: Card[],
    cardIds: number[],
    size?: number
}
export default function DeckThumbnail({cards, cardIds, size = 156}: DeckThumbnailProps) {
    return (
        <Stack direction="row" spacing={1} style={{justifyContent: "center"}}>
            {cardIds.map(it =>
                <CardThumbnail key={it} cards={cards} cardId={it} size={size}/>
            )}
        </Stack>
    )
}

