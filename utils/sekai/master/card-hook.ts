import {useEffect, useState} from "react";
import {Card} from "sekai-calculator";
import {KitDataProvider} from "../calculator/kit-data-provider";

const dataProvider = new KitDataProvider("1145141919810");

export default function useCards() {
    const [cards, setcards] = useState<Card[]>()
    useEffect(() => {
        dataProvider.getMasterData("cards").then((data: Card[]) => {
            setcards(data)
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
