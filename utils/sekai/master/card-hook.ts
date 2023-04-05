import {useEffect, useState} from "react";
import {Card} from "sekai-calculator";
import {KitDataProvider} from "../calculator/kit-data-provider";

const dataProvider = KitDataProvider.DEFAULT_INSTANCE

export default function useCards() {
    const [cards, setCards] = useState<Card[]>()
    useEffect(() => {
        dataProvider.getMasterData("cards").then((data: Card[]) => {
            setCards(data)
        })
    }, [])
    return cards
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
