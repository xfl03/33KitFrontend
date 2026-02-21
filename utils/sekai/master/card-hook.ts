import {useEffect, useState} from "react";
import {Card} from "sekai-calculator";
import useMasterData from "./common";

export default function useCards(server: string = "jp") {
    return useMasterData<Card>("cards", server)
}

export function useCard(cardId: number, server: string = "jp") {
    const cards = useCards(server);
    const [card, setCard] = useState<Card>()
    useEffect(() => {
        if (cards === undefined) return
        setCard(cards.find(it => it.id === cardId))
    }, [cardId, cards])
    return card
}
