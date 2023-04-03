import CardThumbnail from "./card-thumbnail";
import {Stack} from "@mui/material";

type DeckThumbnailProps = {
    cardIds: number[],
    size?: number
}
export default function DeckThumbnail({cardIds, size = 156}: DeckThumbnailProps) {
    return (
        <Stack direction="row" spacing={1} style={{justifyContent:"center"}}>
            {cardIds.map(it =>
                <CardThumbnail key={it} cardId={it} size={size}/>
            )}
        </Stack>
    )
}

