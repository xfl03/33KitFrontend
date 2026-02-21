import CardThumbnail from "./card-thumbnail";
import {Stack} from "@mui/material";
import {DeckCardDetail} from "sekai-calculator";

type DeckThumbnailProps = {
    server: string,
    cardIds: number[],
    deckCards?: DeckCardDetail[],
    size?: number,
}
export default function DeckThumbnail({server = "jp", cardIds, deckCards, size = 156}: DeckThumbnailProps) {
    return (
        <Stack direction="row" spacing={1} style={{justifyContent: "center"}}>
            {cardIds.map((it, i) =>
                <CardThumbnail key={it} cardId={it} deckCard={deckCards ? deckCards[i] : undefined} size={size} server={server}/>
            )}
        </Stack>
    )
}

