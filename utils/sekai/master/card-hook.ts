import {useEffect, useState} from "react";
import {Card} from "sekai-calculator";
import {KitDataProvider} from "../calculator/kit-data-provider";
import useMasterData from "./common";

const dataProvider = KitDataProvider.DEFAULT_INSTANCE

export default function useCards() {
    return useMasterData<Card>("cards")
}

export function useCard(cardId: number) {
    const [card, setCard] = useState<Card>()
    useEffect(() => {
        dataProvider.getMasterData("cards").then((cards: Card[]) => {
            setCard(cards.find(it => it.id === cardId))
        })
    }, [cardId])
    return card
}
